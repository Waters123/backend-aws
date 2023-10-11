module.exports.getProductsById = async (event) => {
  const index = Math.random() >= 0.5 ? 1 : 0;
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      [
        [
          {
            id: 0,
            title: "toy 1",
            description: "desc for toy 1",
            price: 11,
          },
          {
            id: 1,
            title: "toy 2",
            description: "desc for toy 2",
            price: 22,
          },
          {
            id: 2,
            title: "toy 3",
            description: "desc for toy 3",
            price: 33,
          },
        ][index],
      ],
      null,
      2
    ),
  };
};
