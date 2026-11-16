import api from "./api";

const USAR_MOCK = true;

function responderMock(mensagem) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        resposta: `Você disse: "${mensagem}". Em breve vou conseguir te recomendar jogos de acordo com o seu gosto!`,
      });
    }, 800);
  });
}

export const chatbotService = {
  enviar: async (mensagem) => {
    if (USAR_MOCK) {
      return responderMock(mensagem);
    }

    const response = await api.post("/v1/chatbot", { mensagem });
    return response.data;
  },
};