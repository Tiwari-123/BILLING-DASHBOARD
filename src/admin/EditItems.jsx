import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import { useAuth } from '../AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import iziToast from 'izitoast';
import axios from 'axios';

const EditItems = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { apipath } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    price: '',
    status: true, // default to true or false as needed
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(apipath + `/items/details/${itemId}`);
      setFormData(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'status' ? value === 'true' : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apipath}/items/details/${itemId}`, formData);
      iziToast.success({
        message: "Item update successful",
        position: "topCenter",
      });
      navigate("/item");
    } catch (error) {
      console.error("Error updating item details:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      setIsLoading(true);
      await axios.delete(`${apipath}/items/details/${itemId}`);
      setIsLoading(false);
      iziToast.success({
        message: "Item deleted successfully",
        position: "topCenter",
      });
      navigate("/item");
    } catch (error) {
      console.error('Error deleting item:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <SideBar />
      <section className="home">
        <div className="toggle-sidebar" style={{ display: "none" }}>
          <i className="bi bi-menu"></i>
        </div>
        <div className='admin-banner'>
        <Link className="add-btn">
          <button 
            className="btn btn-danger"
            onClick={() => handleDelete(itemId)}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
          </Link>
        </div>
        <div className="container pt-3">
          <div className="row top-barcolumn">
            <div className="col-lg-10 nav-column">
              <h5>Edit Item</h5>
              <div>
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <div className="p-block row">
                      <div className="col-lg-6">
                        <div className="p-field">
                          <label htmlFor="item_name">Item Name</label>
                          <div className="input-group p-group">
                            <div className="input-group-prepend p-prepend">
                              <span className="input-group-text p-group-text" id="basic-addon1">
                                <i className="bi bi-person"></i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control p-control"
                              placeholder="Enter Item Name"
                              aria-label="item_name"
                              aria-describedby="basic-addon1"
                              name="item_name"
                              value={formData.item_name}
                              onChange={handleChange}
                              maxLength="100"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="p-field">
                          <label htmlFor="price">Item Price</label>
                          <div className="input-group p-group">
                            <div className="input-group-prepend p-prepend">
                              <span className="input-group-text p-group-text" id="basic-addon1">
                                <i className="bi bi-currency-dollar"></i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control p-control"
                              placeholder="Enter Item Price"
                              aria-label="price"
                              aria-describedby="basic-addon1"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              maxLength="100"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="p-block row">
                      <div className="col-lg-6">
                        <div className="p-field">
                          <label htmlFor="status">Item Status</label>
                          <div className="input-group p-group">
                            <select
                              name="status"
                              id="status"
                              className="form-control p-control"
                              value={formData.status}
                              onChange={handleChange}
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cancel-create-btn">
                    <Link to="/item">
                      <button className="in-btn1">
                        Cancel
                      </button>
                    </Link>
                    <button type="submit" className="in-btn2">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditItems;
