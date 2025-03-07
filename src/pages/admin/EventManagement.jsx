import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Loading from "../../components/Loading";

const ITEMS_PER_PAGE = 10;

function EventManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const events = useQuery(api.events.get);

  if (!events) {
    return <Loading />;
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const currentData = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const showSwal = () => {
    withReactContent(Swal).fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
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
    <div className="p-6 w-full max-w-full">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-end items-center mb-4 lg:flex-3/4-col">
          <input
            type="text"
            placeholder="Search events..."
            className="input mt-3 w-3/4 lg:w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="table table-auto min-w-max text-xs sm:text-sm border border-base-content/5">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(event => {
                const eventTime = new Date(event.eventDate).getTime();
                const isUpcoming = eventTime > Date.now();

                return (
                  <tr key={event._id} className="hover:bg-base-200">
                    <td>{event.name}</td>
                    <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td>{event.location}</td>
                    <td>{event.price}</td>
                    <td>
                      <span className={`badge ${isUpcoming}`}>
                        {isUpcoming ? "Upcoming" : "Past"}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-ghost" onClick={showSwal}>
                        <Trash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 mr-5 ml-5">
          <p>Showing {currentData.length} of {filteredEvents.length} entries</p>
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

export default EventManagement;
