import api from "./api";

export const categoriaService = {
  listar: async () => {
    const response = await api.get("/v1/categoria");
    return response.data;
  },
};
