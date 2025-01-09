import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserPreferences {
  fontSize: number;
  lineHeight: number;
  showLineNumbers: boolean;
  theme: 'dark' | 'darker';
}

interface ScriptForgeState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  preferences: UserPreferences;
  isGenerating: boolean;
  error: string | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  clearCurrentConversation: () => void;
  deleteMessage: (messageId: string) => void;
}

export const useStore = create<ScriptForgeState>()(
  persist(
    (set) => ({
      conversations: [],
      currentConversation: null,
      preferences: {
        fontSize: 14,
        lineHeight: 1.6,
        showLineNumbers: true,
        theme: 'dark',
      },
      isGenerating: false,
      error: null,
      addMessage: (message) =>
        set((state) => {
          const newMessage = {
            ...message,
            id: crypto.randomUUID(),
            timestamp: new Date(),
          };

          if (!state.currentConversation) {
            const newConversation: Conversation = {
              id: crypto.randomUUID(),
              messages: [newMessage],
              createdAt: new Date(),
            };
            return {
              currentConversation: newConversation,
              conversations: [...state.conversations, newConversation],
            };
          }

          const updatedConversation = {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, newMessage],
          };

          return {
            currentConversation: updatedConversation,
            conversations: state.conversations.map((conv) =>
              conv.id === updatedConversation.id ? updatedConversation : conv
            ),
          };
        }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),
      clearCurrentConversation: () => set({ currentConversation: null }),
      deleteMessage: (messageId) => set((state) => {
        if (!state.currentConversation) return state;
        
        const updatedMessages = state.currentConversation.messages.filter(
          msg => msg.id !== messageId
        );
        
        const updatedConversation = {
          ...state.currentConversation,
          messages: updatedMessages
        };
        
        return {
          currentConversation: updatedMessages.length ? updatedConversation : null,
          conversations: updatedMessages.length 
            ? state.conversations.map(conv => 
                conv.id === updatedConversation.id ? updatedConversation : conv
              )
            : state.conversations.filter(conv => conv.id !== state.currentConversation.id)
        };
      }),
    }),
    {
      name: 'script-forge-storage',
    }
  )
);