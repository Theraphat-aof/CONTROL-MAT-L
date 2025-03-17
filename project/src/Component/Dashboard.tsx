/* eslint-disable @typescript-eslint/no-explicit-any */
import "../Style/Dashboard.css";
import React, { useState, useEffect } from "react";
import { getProductions, addProductions, deleteProductions } from "../API/API";
import Navbar from "./Navbar";

export interface Productions {
  line_name: string
  model_name: string
  mo_number: string
  qty: number
}

const Dashboard = () => {
  const [formData, setFormData] = useState({
    line: "",
    model: "",
    mo: "",
    qty: "",
  });
  const [productions, setProductions] = useState<Productions[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      const data = await getProductions();
      setProductions(data);
      setCurrentPage(1);
    } catch (error: any) {
      console.error("Failed to fetch productions:", error.message);
      setMessage(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const message = await addProductions(formData);
      setMessage(message);
      setFormData({ line: "", model: "", mo: "", qty: "" });
      fetchProductions();
      closeModal();
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteLine || !deleteModelName) return;

    try {
      const message = await deleteProductions(deleteLine, deleteModelName);
      setMessage(message);
      fetchProductions();
      closeModalDelete();
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const [isAddModal, setIsModal] = useState(false);
  const [modalType, setModalType] = useState<string>("");

  const openModal = (type: string) => {
    setModalType(type);
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const [deleteModelName, setDeleteModelName] = useState<string | null>(null);
  const [deleteLine, setDeleteLine] = useState<string | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const openModalDelete = (line: string, model: string) => {
    setDeleteLine(line);
    setDeleteModelName(model);
    setIsDeleteModal(true);
  };

  const closeModalDelete = () => {
    setDeleteModelName(null);
    setIsDeleteModal(false);
  };

  const [search, setSearch] = useState("");
  const filteredProductions = productions.filter((prod) =>
    prod.model_name.toLowerCase().includes(search.toLowerCase())
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductions = filteredProductions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProductions.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="container-dash">
        <span onClick={() => openModal("add")}>
          <i className="bi bi-plus-circle-fill"></i>
        </span>
        <i className="bi bi-search"></i>
        <input
          type="text"
          placeholder="Search by Model"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginLeft: "53.2em",
            padding: "10px",
            paddingLeft: "3em",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
            width: "38.8vw",
          }}
        />

        {isAddModal && (
          <div className="modal-add" onClick={closeModal}>
            <div
              className="modal-add-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>
                {modalType === "add" ? "Add Production" : "Edit Production"}
              </h2>
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Line</span>
                  <input
                    type="text"
                    name="line"
                    value={formData.line}
                    onChange={handleChange}
                    placeholder="Enter Line"
                  />
                </label>
                <label>
                  <span>Model</span>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Enter Models"
                  />
                </label>
                <label>
                  <span>MO</span>
                  <input
                    type="text"
                    name="mo"
                    value={formData.mo}
                    onChange={handleChange}
                    placeholder="Enter MO"
                  />
                </label>
                <label>
                  <span>Quantity</span>
                  <input
                    type="number"
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    placeholder="Enter Quantity"
                  />
                </label>
                <label></label>
                <div className="modal-action">
                  <button type="submit">Confirm</button>
                  <button type="button" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {message && <p>{message}</p>}

        {isDeleteModal && (
          <div className="modal-delete">
            <div className="modal-delete-content">
              <h2>Confirm Delete</h2>
              <p style={{ marginBottom: "1em" }}>
                Are you sure you want to delete the production for <br /> Line:{" "}
                <strong style={{ color: "red" }}>{deleteLine}</strong> and
                Model:{" "}
                <strong style={{ color: "red" }}>{deleteModelName}</strong>
              </p>
              <div className="modal-action">
                <button type="submit" onClick={closeModalDelete}>
                  NO
                </button>
                <button type="button" onClick={handleDelete}>
                  YES
                </button>
              </div>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Line</th>
              <th>Model</th>
              <th>MO</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProductions.length > 0 ? (
              currentProductions.map((prod: any, index: number) => (
                <tr key={index}>
                  <td>{prod.line_name}</td>
                  <td>{prod.model_name}</td>
                  <td>{prod.mo_number}</td>
                  <td>{prod.qty.toLocaleString()}</td>
                  <td>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        openModalDelete(prod.line_name, prod.model_name)
                      }
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{textAlign:"center"}}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredProductions.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
              flexWrap: "wrap",
            }}
          >
            <div
              className="pagination"
              style={{
                display: "flex",
                gap: "5px",
              }}
            >
              <button
                className="btn-number"
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #202124",
                  borderRadius: "4px",
                  background: currentPage === 1 ? "#f0f0f0" : "#fff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                &laquo;
              </button>
              <button
                className="btn-number"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #202124",
                  borderRadius: "4px",
                  background: currentPage === 1 ? "#f0f0f0" : "#fff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                &lsaquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                if (
                  i === 0 ||
                  i === totalPages - 1 ||
                  (i >= currentPage - 2 && i <= currentPage + 1)
                ) {
                  return (
                    <button
                      className="btn-number"
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #202124",
                        borderRadius: "4px",
                        background: currentPage === i + 1 ? "#007bff" : "#fff",
                        color: currentPage === i + 1 ? "#fff" : "#000",
                        cursor: "pointer",
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                }

                if (
                  (i === 1 && currentPage > 3) ||
                  (i === totalPages - 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span
                      key={i + 1}
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ...
                    </span>
                  );
                }

                return null;
              })}

              <button
                className="btn-number"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #202124",
                  borderRadius: "4px",
                  background: currentPage === totalPages ? "#f0f0f0" : "#fff",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                &rsaquo;
              </button>
              <button
                className="btn-number"
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #202124",
                  borderRadius: "4px",
                  background: currentPage === totalPages ? "#f0f0f0" : "#fff",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                &raquo;
              </button>
            </div>

            <div
              style={{
                margin: "10px 0 0",
                width: "100%",
                textAlign: "center",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Show {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredProductions.length)} From all{" "}
              {filteredProductions.length} Item
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
