import Image from "next/image";
import { IoHomeSharp, IoPersonAddSharp  } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import logo from "../images/logo.png";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-gray-700 text-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={60} height={60} />
            <span className="text-xl font-bold">UniSys</span>
         </div>
      <div className="text-lg font-medium">Teacher Panel</div>
       <a href="/login" className="px-4 py-2 cursor-pointer bg-red-600 rounded hover:bg-red-500">
        Logout
      </a>
     </header>

      <div className="flex flex-1">
        <nav className="w-64 bg-gray-200 p-4 shadow-inner">
          <ul className="space-y-4">
            <li>
              <a
                href="/"
                className=" flex p-2 text-lg rounded hover:bg-gray-300 text-gray-700"
              >
            <IoHomeSharp className=" mr-5 mt-1" />
                Home
              </a>
            </li>
            <li>
              <a
                href="/profile"
                className="flex p-2  text-lg rounded hover:bg-gray-300 text-gray-700"
              >
                <FaUser className=" mr-5 mt-1" />
                Profile
              </a>
            </li>
          </ul>
        </nav>


<main className="flex-1 p-8 bg-white">
  <h1 className="text-2xl text-center font-bold mb-4">Student Tasks</h1>
  <p className="text-gray-700 mb-6 text-center">
  View the students tasks. if tasks complete then delete it otherwise edit and prepare.
  </p>

  <div className="grid grid-cols-2 gap-6">
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Student 1</h2>
        <p className="text-sm text-gray-600">Task 1: Tomorrow will be your quiz</p> 
        <p className="text-sm text-gray-600">Task 2: Tomorrow English Assignment to be submitted </p> 
      </div>
      <div className="flex space-x-3">
        <button className="text-blue-500 hover:text-blue-700">
          <MdEdit size={24} /> 
        </button>
        <button className="text-red-500 hover:text-red-700">
          <MdDelete size={24} /> 
        </button>
      </div>
    </div>

    {/* Card 2 */}
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Student 2</h2>
        <p className="text-sm text-gray-600">Task 1: Tomorrow English Assignment to be submitted </p> 
      </div>
      <div className="flex space-x-3">
        <button className="text-blue-500 hover:text-blue-700">
          <MdEdit size={24} /> 
        </button>
        <button className="text-red-500 hover:text-red-700">
          <MdDelete size={24} /> 
        </button>
      </div>
    </div>

    {/* Card 3 */}
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Student 3</h2>
        <p className="text-sm text-gray-600">There is no Task for you</p>
      </div>
      <div className="flex space-x-3">
        <button className="text-blue-500 hover:text-blue-700">
          <MdEdit size={24} /> 
        </button>
        <button className="text-red-500 hover:text-red-700">
          <MdDelete size={24} /> 
        </button>
      </div>
    </div>

    {/* Card 4 */}
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Student 4</h2>
        <p className="text-sm text-gray-600">Task 1: Tomorrow will be your quiz</p> 
        <p className="text-sm text-gray-600">Task 2: Tomorrow English Assignment to be submitted </p>
        <p className="text-sm text-gray-600">Info: Deposite your university fees</p>
          </div>
      <div className="flex space-x-3">
        <button className="text-blue-500 hover:text-blue-700">
          <MdEdit size={24} /> {/* Edit Icon */}
        </button>
        <button className="text-red-500 hover:text-red-700">
          <MdDelete size={24} /> {/* Delete Icon */}
        </button>
      </div>
    </div>
    
  </div>
</main>

      </div>

      <footer className="p-4 bg-gray-800 text-center text-white">
        © 2025 UniSys. All rights reserved.
      </footer>
    </div>
  );
}
