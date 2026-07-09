import { useEffect, useState } from "react";
import { getMyMembers } from "../services/managerService";

const MemberDetails = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMyMembers().then(setMembers);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">My Members</h1>

      <div className="grid grid-cols-3 gap-5">
        {members.map((member) => (
          <div key={member._id} className="bg-white p-5 rounded shadow">
            <h3 className="font-bold">{member.name}</h3>
            <p>{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDetails;