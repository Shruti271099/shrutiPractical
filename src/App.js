import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = "https://jsonplaceholder.typicode.com/posts";

function App() {
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_BASE);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const debouncedSearch = debounce((query) => {
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, 700);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };
  
  return (
    <div className="container">
      <h3>Shruti's Practical</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by title"
      />
      <ul>
        {currentItems.map((item) => (
          <li key={item.id}>
            <h3>
              {item.id} - {item.title}
            </h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <p> {currentPage}</p>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
