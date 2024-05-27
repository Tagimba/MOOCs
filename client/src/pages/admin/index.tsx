import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { getAllCourses } from "../../utils/api/courses";
import Table from "../../components/Course/Table";
import { Courses } from "../../types";
import Modal from "../../components/Modal";
import AddCourse from "../../components/Course/AddCourse";
import { toast } from "react-toastify";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Trans } from "@lingui/macro";

/**
 * @category Client
 * @subcategory Pages
 * @module Admin Board
 * @description The dashboard for admin to access and manage all courses.
 * @component
 * @example
 *  <Route path="/admin/dashboard" element={<AdminBoard />} />
 */

export default function index() {
  const [selectedCourse, setSelectedCourse] = useState<any>({});
  const [courses, setCourses] = useState<Courses[]>([]);
  const [isLoading, setLoading] = useState(false);

  const getAvailableCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses();
      if (response.success) {
        setLoading(false);
        setCourses(response.data);
      }
    } catch (error) {
      toast.error("Fetching data failed", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    getAvailableCourses();
  }, []);

  const handleSelectedCourse = (selectedCourse: any) => {
    setSelectedCourse(selectedCourse);
  };

  return (
    <section className="h-screen admin-dashboard">
      <h1 className="text-center mb-6 text-xl"><Trans>Admin Board</Trans></h1>

      {selectedCourse?.title ? (
        <Modal
          show={selectedCourse?.title}
          handleClose={() => setSelectedCourse("")}
        >
          <AddCourse
          getAvailableCourses={getAvailableCourses}
            role="Admin"
            handleSelectedCourse={handleSelectedCourse}
            selectedCourse={selectedCourse}
          />
        </Modal>
      ) : isLoading ? (
        <div className="h-screen flex items-center flex-col justify-center">
          <Spinner width="100px" height="100px" color="#009985" />
        </div>
      ) : courses?.length > 0 ? (
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">All courses</h2>
            <Link
              to={`/course/add-course`}
              className="bg-primary hover:bg-primary-hover text-sm text-white rounded-md px-3 py-3"
            >
              {" "}
              <span className="flex items-center justify-center gap-x-1">
                {" "}
                <IoMdAddCircleOutline size={18} /> Add New Course
              </span>
            </Link>
          </div>

          <Table
           getAvailableCourses={ getAvailableCourses}
            courses={courses}
            handleSelectedCourse={handleSelectedCourse}
          />
        </div>
      ) : (
        <div className="flex items-center flex-col h-96 justify-center">
          <p className="py-3 text-gray-dark/50"> No Course Added</p>
          <Link
            to={`/course/add-course`}
            className="bg-primary hover:bg-primary-hover text-sm text-white rounded-md px-3 py-2"
          >
            {" "}
            <span className="flex items-center justify-center gap-x-1">
              {" "}
              <IoMdAddCircleOutline size={18} /> Add New Course
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
