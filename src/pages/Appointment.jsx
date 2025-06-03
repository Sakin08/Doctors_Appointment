import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots,setDocSlot]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime,setSlotTime]=useState('') 

  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo)
  };

  const getAvailableSlots=async ()=>{
      setDocSlot([])

    // getting current date

    let today=new Date()

    for(let i=0;i<7;i++){
      //getting date with index
      let currentDate=new Date(today)
      currentDate.setDate(today.getDate()+i)
      //setting end time of the date with index
      let endTime=new Date()
      endTime.setDate(today.getDate()+1)
      endTime.setHours(21,0,0,0)

      //setting hour
      if(today.getDate===currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10)
        currentDate.setMinutes(currentDate.getMinutes()>30?30:0)
      }else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlot=[]
      while(currentDate<endTime){
        let formattedTime=currentDate.toLocaleTimeString([],{hour:'2 digit', minute:'2-digit '})
        //add slot to array
        timeSlot.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        //increment current time by 30 min
        currentDate.setMinutes(currentDate.getMinutes()+30)
        setDocSlot
      }

    }
  }
  
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId])

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])



return docInfo && (
  <div className="max-w-3xl mx-auto mt-8 px-4">
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300">
      
      {/* Image Section */}
      <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-5 flex items-center justify-center">
        <img
          src={docInfo.image}
          alt={docInfo.name}
          className="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="md:w-2/3 p-5 flex flex-col justify-between space-y-4 text-gray-800">
        
        {/* Name + Verified */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">
            {docInfo.name}
          </h2>
          <img
            src={assets.verified_icon}
            alt="Verified"
            className="w-4 h-4"
            title="Verified Doctor"
          />
        </div>

        {/* Degree + Specialty + Experience */}
        <div className="text-sm text-gray-700">
          <p className="font-semibold">{docInfo.degree} • {docInfo.speciality}</p>
          <p className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mt-1">
            {docInfo.experience} experience
          </p>
        </div>

        {/* About Section */}
        <section>
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
            <img
              src={assets.info_icon}
              alt="Info"
              className="w-4 h-4 opacity-80"
              title="More Information"
            />
          </div>
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
            {docInfo.about}
          </p>
        </section>

        {/* Appointment Fee */}
        <div className="mt-3 text-sm font-semibold text-gray-900">
          Appointment fee:{" "}
          <span className="text-blue-600">
            {currencySymbol}{docInfo.fees}
          </span>
        </div>
      </div>
    </div>
  </div>
);



};

export default Appointment;
