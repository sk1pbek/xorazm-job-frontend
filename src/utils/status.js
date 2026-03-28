export const getStatusStyle = (status) => {
  switch (status) {
    case "accepted":
      return { color: "green", fontWeight: "bold" };

    case "rejected":
      return { color: "red", fontWeight: "bold" };

    default:
      return { color: "orange", fontWeight: "bold" };
  }
};
