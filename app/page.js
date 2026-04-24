"use client"
import { useEffect, useState } from "react";

export default function Home() {
  const [new_nPlate, setnew_nPlate] = useState("")
  const [dataArr, setdataArr] = useState([])
  const [keysArr, setkeysArr] = useState([])
  const [carInfo, setcarInfo] = useState([])

  useEffect(() => {

    function getData() {
      const data = localStorage.getItem("car.me")
      if (data) {
        setdataArr(JSON.parse(data))
      }
      else {
        localStorage.setItem("car.me", JSON.stringify(dataArr))
        console.log("new user");
      }
    }
    getData()
  }, []);
  // save dataArr to local storage every time it changes so that the most up to date data is always saved and can be retrieved on page load
  useEffect(() => {
    localStorage.setItem("car.me", JSON.stringify(dataArr));
    console.log("Saved to localStorage:", dataArr);
  }, [dataArr]);

  function genrateKey() {
    const num1 = Math.floor(Math.random() * 9)
    const num2 = Math.floor(Math.random() * 9)
    const num3 = Math.floor(Math.random() * 9)
    const num4 = Math.floor(Math.random() * 9)
    const num5 = Math.floor(Math.random() * 9)

    const nKey = `${num1}${num2}${num3}${num4}${num5}`
    return nKey

  }

  // save dataArr to local storage every time it changes so that the most up to date data is always saved and can be retrieved on page load
  useEffect(() => {

    const getCarData = async () => {
      try {

        // temporary array to build fresh car info
        const updatedCars = [];

        // loop through each registered vehicle
        for (let index = 0; index < dataArr.length; index++) {

          // get registration and format it
          const reg = dataArr[index][1]
            .toUpperCase()
            .replace(/\s/g, "");

          console.log("Fetching:", reg);

          // fetch vehicle data from backend
          const response = await fetch("/api/carData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reg }),
          });

          // convert response to JSON

          const data = await response.json();

          console.log(`Data fetched for ${reg}:`, data);

          // get tax status
          const isTaxed = data.taxStatus;

          if (!isTaxed) {
            alert(`Vehicle ${reg} not found or has no tax status.`);

            setdataArr(prev =>
              prev.filter(car => car[1] !== reg)
            );

            continue;
          }

          // add vehicle into temporary array
          updatedCars.push([
            dataArr[index][0], // unique key
            reg,               // registration
            isTaxed            // tax status
          ]);
        }

        // update state ONCE after loop finishes
        setcarInfo(updatedCars);

        console.log("Final carInfo:", updatedCars);

      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    // only run if cars exist
    if (dataArr.length > 0) {
      getCarData();
    }

  }, [dataArr]);

  async function handleRegisterCar() {
    let nKey = genrateKey()
    while (keysArr.includes(nKey)) {
      console.log("key collided");
      nKey = genrateKey()
    }
    // if number plate is empty don't go ahead
    if (new_nPlate.trim() === "") {
      alert("Please enter a number plate.");
      return;
    }
    const formatted_nPlate = new_nPlate.toUpperCase().replace(/\s/g, "")
    // check if number plate is already registered and if it is don't go ahead

    if (dataArr.some(car => car[1] === formatted_nPlate)) {
      alert("This number plate is already registered.");
      return;
    }

    setdataArr(prev => [...prev, [nKey, formatted_nPlate]]);
    setkeysArr(prev => [...prev, nKey])
    // save() - don't need to call this function as the useEffect will run every time dataArr changes and save the most up to date dataArr to local storage
    setnew_nPlate("")



  }
  // console.log("important");

  // console.log(dataArr);


  return (
    <>
  <main className="min-h-screen flex flex-col gap-10 justify-center items-center bg-gradient-to-br from-sky-100 via-white to-cyan-100 px-6 py-20 relative overflow-hidden">

    {/* background glow */}
    <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-cyan-300/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-300/30 rounded-full blur-3xl"></div>

    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-800 text-center">
      Car Registration
    </h1>

    <div className="w-full max-w-lg flex flex-col gap-5 items-center bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[32px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

      <label
        className="font-semibold text-slate-600 tracking-wide text-sm uppercase"
        htmlFor="nPlate"
      >
        Number Plate
      </label>

      <input
        value={new_nPlate}
        onChange={(e) => setnew_nPlate(e.target.value)}
        type="text"
        placeholder="AB12CDE"
        id="nPlate"
        name="nPlate"
        className="w-full text-center text-lg font-bold tracking-[0.25em] uppercase border border-white/50 bg-white/70 text-slate-800 rounded-2xl py-4 px-6 outline-none shadow-inner transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-cyan-200 placeholder:text-slate-400"
      />

      <input
        type="submit"
        onClick={handleRegisterCar}
        value="Register Car"
        className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-300/50 active:scale-95"
      />
    </div>

  </main>

  <section className="w-full flex items-center flex-col gap-6 px-6 py-16 bg-gradient-to-b from-slate-50 to-sky-50">

    {carInfo.map(car => (
      <div
        key={car[0]}
        className="w-full max-w-2xl flex justify-between items-center rounded-[28px] px-8 py-6 bg-white/70 backdrop-blur-xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:scale-[1.01] hover:shadow-[0_15px_50px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold tracking-wider text-slate-800">
            {car[1]}
          </p>

          <p className="text-sm text-slate-500">
            Vehicle Status
          </p>
        </div>

        <p
          className={`text-sm font-bold px-5 py-2 rounded-full shadow-sm ${
            car[2] === "Taxed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {car[2]}
        </p>

      </div>
    ))}

  </section>
</>
  );
}


// {cars.map(car => (
//   <div key={car.plate}>
//     <h3>{car.plate}</h3>
//     <p>{car.model}</p>
//   </div>
// ))}