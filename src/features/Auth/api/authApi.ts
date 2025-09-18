// دلوقتي مجرد دالة وهمية، بعدين نربطه بـ axiosInstance
export const fakeLoginApi = async (email: string, password: string) => {
  if (email === "admin@test.com" && password === "123456") {
    return { id: 1, name: "Admin User", email };
  }
  throw new Error("Invalid credentials");
};
