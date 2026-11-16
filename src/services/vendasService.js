import api from "./api";

export const vendasService = {
  consultar: async ({ inicio, fim, categorias }) => {
    const response = await api.get("/v1/relatorios/vendas", {
        params: {inicio, fim, categorias: categorias.join(",")},
    });
    return response.data;
  },

};
