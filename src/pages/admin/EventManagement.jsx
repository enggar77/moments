import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const concerts = [
  { id: 1, name: "Summer Rock Festival", date: "Jul 15, 2025", venue: "Central Park Arena", price: "$89.99", status: "Upcoming" },
  { id: 2, name: "Jazz Night Special", date: "Aug 22, 2025", venue: "Blue Note Club", price: "$120.00", status: "On Sale" },
  { id: 3, name: "Pop Music Awards", date: "Sep 05, 2025", venue: "Metropolitan Hall", price: "$150.00", status: "Draft" },
  { id: 13, name: "Summer Rock Festival", date: "Jul 15, 2025", venue: "Central Park Arena", price: "$89.99", status: "Upcoming" },
  { id: 23, name: "Jazz Night Special", date: "Aug 22, 2025", venue: "Blue Note Club", price: "$120.00", status: "On Sale" },
  { id: 33, name: "Pop Music Awards", date: "Sep 05, 2025", venue: "Metropolitan Hall", price: "$150.00", status: "Draft" },
  { id: 14, name: "Summer Rock Festival", date: "Jul 15, 2025", venue: "Central Park Arena", price: "$89.99", status: "Upcoming" },
  { id: 24, name: "Jazz Night Special", date: "Aug 22, 2025", venue: "Blue Note Club", price: "$120.00", status: "On Sale" },
  { id: 34, name: "Pop Music Awards", date: "Sep 05, 2025", venue: "Metropolitan Hall", price: "$150.00", status: "Draft" },
  { id: 15, name: "Summer Rock Festival", date: "Jul 15, 2025", venue: "Central Park Arena", price: "$89.99", status: "Upcoming" },
  { id: 25, name: "Jazz Night Special", date: "Aug 22, 2025", venue: "Blue Note Club", price: "$120.00", status: "On Sale" },
  { id: 35, name: "Pop Music Awards", date: "Sep 05, 2025", venue: "Metropolitan Hall", price: "$150.00", status: "Draft" },
  // Tambahkan lebih banyak data di sini
];

const ITEMS_PER_PAGE = 10;

 function EventManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredConcerts = concerts.filter((concert) =>
        concert.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const totalPages = Math.ceil(filteredConcerts.length / ITEMS_PER_PAGE);
      const currentData = filteredConcerts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    
    // const totalPages = Math.ceil(concerts.length / ITEMS_PER_PAGE);
    // const currentData = concerts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    
    const showSwal = () => {
      withReactContent(Swal).fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          withReactContent(Swal).fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
    };
    

  return (
    <div className="p-6 block">
      <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center mb-4 lg:flex-3/4-col ">
        <button className="btn btn-primary mt-3">+ Add New Concert</button>
        <input type="text" placeholder="Search concerts..." className="input mt-3" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="overflow-x-auto">
        <table className="table  table-auto min-w-full text-xs sm:text-sm border border-base-content/5">
          <thead className="flex-wrap">
            <tr>
              <th>Concert Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((concert) => (
              <tr key={concert.id} className="hover:bg-base-200 flex-wrap">
                <td>{concert.name}</td>
                <td>{concert.date}</td>
                <td>{concert.venue}</td>
                <td>{concert.price}</td>
                <td><span className="badge badge-outline">{concert.status}</span></td>
                <td>
                  <button className="btn btn-sm btn-ghost"><Pencil /></button>
                  <button className="btn btn-sm btn-ghost" onClick={() => showSwal()}><Trash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4 mr-5 ml-5">
        <p>Showing {currentData.length} of {concerts.length} entries</p>
        <div className="join gap-3">
          <button 
            className="btn btn-sm rounded-md w-20 hover:border-black hover:bg-white" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button 
              key={index} 
              className={`btn btn-sm rounded-md ${currentPage === index + 1 ? 'btn-active bg-black text-white' : ''}`} 
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button 
            className="btn btn-sm rounded-md w-20 hover:border-black hover:bg-white" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default EventManagement
