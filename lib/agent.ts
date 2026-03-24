import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableLike } from "@langchain/core/runnables";
import {
    END,
    InMemoryStore,
    MemorySaver,
    MessagesAnnotation,
    START,
    StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";



const model = new ChatOpenAI({
    model: "gpt-4o",
}).bindTools([
]);

// Example of how to access authenticated user context in a node
// The auth handler returns user data that can be accessed via config.configurable.auth
const callLLM = async (
    state: typeof MessagesAnnotation.State,
    config?: any,
) => {
    // Ensure messages array exists
    if (!state.messages) {
        console.log("⚠️ No messages in state, initializing empty array");
        state.messages = [];
    }

    // Access authenticated user data from the standard LangGraph location
    const authenticatedUser = config?.configurable?.langgraph_auth_user;
    if (authenticatedUser) {
        console.log("👤 Authenticated user found:", authenticatedUser);
        console.log("User ID:", authenticatedUser.sub);
        console.log("User Email:", authenticatedUser["https://assistant0-api/email"]);
        console.log("User Name:", authenticatedUser["https://assistant0-api/name"]);

        // Add user context to the system message if not already present
        const hasSystemMessage = state.messages.some(
            (msg) => msg._getType() === "system",
        );
        if (!hasSystemMessage) {
            const audience_path = process.env.AUTH0_AUDIENCE || [];
            const userContext = `
            You are authenticated as ${authenticatedUser.sub} via Auth0.
            The username is ${authenticatedUser[audience_path + "/name"]} and their email is ${authenticatedUser[audience_path + "/email"]}.
            `;

            // Add a system message with user context
            const systemMessage = new SystemMessage({
                content: [
                    {
                        type: "text",
                        text: `You are Echo, a helpful AI assistant. Always identify yourself as Echo when appropriate.`,
                    },
                    {
                        type: "text",
                        text: `${userContext} The user has the following scopes: ${authenticatedUser.scope || "none"}.`,
                    },
                    {
                        type: "text",
                        text: `The current date and time is ${new Date().toISOString()}.`,
                    },
                ],
            });
            state.messages.unshift(systemMessage);
        }
    } else {
        console.log(
            "❌ No authenticated user found in config.configurable.langgraph_auth_user",
        );
    }

    const response = await model.invoke(state.messages);
    return { messages: [response] };
};

const routeAfterLLM: RunnableLike = function (state) {
    // Ensure messages array exists and has content
    if (!state.messages || state.messages.length === 0) {
        return END;
    }

    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (!lastMessage.tool_calls?.length) {
        return END;
    }
    return "tools";
};

const stateGraph = new StateGraph(MessagesAnnotation)
    .addNode("callLLM", callLLM)
    .addNode(
        "tools",
        new ToolNode(
            [],
            {
                // Error handler should be disabled in order to
                // trigger interruptions from within tools.
                handleToolErrors: false,
            },
        ),
    )
    .addEdge(START, "callLLM")
    .addConditionalEdges("callLLM", routeAfterLLM, [END, "tools"])
    .addEdge("tools", "callLLM");

const checkpointer = new MemorySaver();
const store = new InMemoryStore();

export const graph = stateGraph.compile({
    checkpointer,
    store,
    interruptBefore: [],
    interruptAfter: [],
});
