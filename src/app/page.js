"use client";

import { Task } from "@/components/Task";
import { UserCard } from "@/components/UserCard";
import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useState,useEffect } from "react";

export default function RandomUserPage() {
  //user = null or array of object
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(()=>{
    if(firstLoad){
      setFirstLoad(false);
      return;
    }
    const gen = JSON.stringify(genAmount); //converse object to text
    localStorage.setItem("genAmount",gen);
  },[genAmount]);

  useEffect(() => {
    const genA = localStorage.getItem("genAmount");
    if (genA === null) {
      setGenAmount([1]);
      return;
    }
    const LoadGenAmount = JSON.parse(genA); //converse text to java ob
    setGenAmount(LoadGenAmount);
  },[])  

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)
    const cleaner = users.map((users) => cleanUser(users));
    setUsers(cleaner);
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((user) => (
        <UserCard
         key={user.email}
         name={user.name}
         imgUrl={user.imgUrl}
         address={user.address}
         email={user.email}
        />
      ))}
    </div>
  );
}
