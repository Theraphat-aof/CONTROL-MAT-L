/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:3000";

export const getProductions = async () => {
  try {
    const response = await axios.get(`${API_URL}/Getproductions`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch productions");
  }
};

export const addProductions = async (formData: {
  line: string;
  model: string;
  mo: string;
  qty: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/AddProductions`, formData);
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add production");
  }
};

export const deleteProductions = async (lineName: string, modelName: string) => {
  try {
    const response = await axios.delete(`${API_URL}/DeleteProductions`, {
      data: { line: lineName, model: modelName },
    });
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete production");
  }
};

