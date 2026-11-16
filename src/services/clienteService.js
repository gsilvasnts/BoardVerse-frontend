import api from "./api";

export const clienteService = {
  listar: async () => {
    const response = await api.get("/v1/cliente");
    return response.data;
  },

  cadastrar: async (clienteData) => {
    await api.post("/v1/cliente", clienteData);
  },

  atualizar: async (id, clienteData) => {
    await api.put(`/v1/cliente/${id}`, clienteData);
  },

  inativar: async (id) => {
    await api.patch(`/v1/cliente/${id}/inativar`);
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/v1/cliente/${id}`);
    return response.data;
  },
};
