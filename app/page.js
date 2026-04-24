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

        // loop through each car and fetch data from dvla
        for (let index = 0; index < dataArr.length; index++) {
          const reg = dataArr[index][1].toUpperCase().replace(/\s/g, ""); // remove spaces and uppercase
          console.log(reg);
          // fetch
          const response = await fetch("/api/carData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reg }),
          });
          // returned data from api
          const data = await response.json();
          console.log(`data feteched for ${reg}:`, data);

          const isTaxed = data.taxStatus
          console.log(isTaxed);

          setcarInfo(prev => {
            if (prev.some(car => car[1] === reg)) {
              console.log(`Car with registration ${reg} already exists in carInfo.`);
              return prev;
            }
            const updated = [...prev, [dataArr[index][0], reg, isTaxed]];
            console.log("UPDATED carInfo:", updated);
            return updated;
          });

          console.log(carInfo);




        }

      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };
    // if any change made to dataArr(array containing all car reg and keys)- save it to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("car.me", JSON.stringify(dataArr))
      console.log("saved");
      if (dataArr.length > 0) {
        // get car data each time a new car is registered and added to dataArr so that the most up to date data is always available without needing to refresh the page
        getCarData();
      }
    }
    else {
      console.log("error saving data into local storage");
    }
  }, [dataArr]) // runs every time dataArr changes so waits for the new data to be added before saving


  async function handleRegisterCar() {
    let nKey = genrateKey()
    while (keysArr.includes(nKey)) {
      console.log("key collided");
      nKey = genrateKey()
    }
    const formatted_nPlate = new_nPlate.toUpperCase().replace(/\s/g, "")
    setdataArr(prev => [...prev, [nKey, formatted_nPlate]]);
    setkeysArr(prev => [...prev, nKey])
    // save() - don't need to call this function as the useEffect will run every time dataArr changes and save the most up to date dataArr to local storage
    setnew_nPlate("")



  }
  // console.log("important");

  // console.log(dataArr);


  return (
    <>
  <main className="min-h-screen flex flex-col gap-8 justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-16">

    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg">
      Car Registration
    </h1>

    <div className="w-full max-w-lg flex flex-col gap-4 items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

      <label
        className="font-semibold text-slate-200 tracking-wide text-sm uppercase"
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
        className="w-full text-center text-lg font-bold tracking-widest uppercase border border-slate-600 bg-slate-900/80 text-white rounded-2xl py-4 px-6 outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 placeholder:text-slate-400 placeholder:tracking-wider"
      />

      <input
        type="submit"
        onClick={handleRegisterCar}
        value="Register Car"
        className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-95"
      />
    </div>

  </main>

  <section className="w-full flex items-center flex-col gap-6 px-6 py-12 bg-slate-100">

    {carInfo.map(car => (
      <div
        key={car[0]}
        className="w-full max-w-2xl flex justify-between items-center border border-slate-200 rounded-3xl px-8 py-6 bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        <p className="text-xl font-bold tracking-wide text-slate-800">
          {car[1]}
        </p>

        <p
          className={`text-lg font-bold px-4 py-2 rounded-full ${
            car[2] === "Taxed"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-500"
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