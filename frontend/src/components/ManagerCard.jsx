const ManagerCard = ({ manager }) => {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h3 className="font-bold text-lg">{manager.name}</h3>
      <p>{manager.email}</p>
      <p className="capitalize text-gray-500">{manager.role}</p>
    </div>
  );
};

export default ManagerCard;