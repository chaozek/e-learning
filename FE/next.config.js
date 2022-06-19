module.exports = {
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:8000",
          },
        ],
      },
    ];
  },
};
