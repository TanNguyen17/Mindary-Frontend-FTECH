import axiosInstance from '@/apiConfig';
import { ChatRequest, Conversation, ChatMessage } from '@/app/types/chat';

const getCookie = (cookieName: string) => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) =>
        cookie.startsWith(`${cookieName}=`)
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
};

const handleAuthError = (error: any) => {
    if (error.response?.status === 401) {
        // axios interceptor handle token refresh
        return Promise.reject(error);
    }
    throw error;
};

const getAuthHeaders = () => {
    const token = getCookie('accessToken');
    if (!token) {
        window.location.href = '/login';
        throw new Error('No access token found');
    }
    return {
        Authorization: `Bearer ${token}`
    };
};

export const chatService = {
    // Create new conversation
    createConversation: async (request: ChatRequest) => {
        try {
            const response = await axiosInstance.post('/chat/conversations', request, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },

    // Get user's conversations
    getUserConversations: async (userId: string) => {
        try {
            const response = await axiosInstance.get<Conversation[]>(`/chat/conversations/user/${userId}`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },

    // Get conversation messages
    getConversationMessages: async (conversationId: string) => {
        try {
            const response = await axiosInstance.get<ChatMessage[]>(
                `/chat/conversations/${conversationId}/messages`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },

    // Send message in conversation
    sendMessage: async (conversationId: string, request: ChatRequest) => {
        try {
            const response = await axiosInstance.post<ChatMessage>(
                `/chat/conversations/${conversationId}/messages`,
                request,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },

    // Delete conversation
    deleteConversation: async (conversationId: string) => {
        try {
            const response = await axiosInstance.delete(
                `/chat/conversations/${conversationId}`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },

    // Delete message
    deleteMessage: async (conversationId: string, messageId: string) => {
        try {
            await axiosInstance.delete(
                `/chat/conversations/${conversationId}/messages/${messageId}`,
                { headers: getAuthHeaders() }
            );
        } catch (error) {
            return handleAuthError(error);
        }
    },

    // Update conversation title
    updateConversationTitle: async (conversationId: string, title: string) => {
        try {
            const response = await axiosInstance.patch<Conversation>(
                `/chat/conversations/${conversationId}/title`,
                { title },
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.data) {
                throw new Error('No data received from server');
            }
            return response.data;
        } catch (error: any) {
            return handleAuthError(error);
        }
    }
}; 