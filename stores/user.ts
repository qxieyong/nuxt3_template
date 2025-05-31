export const useInfoStore = defineStore("user_info", {
  state: () => ({
    isLogin: false,
    token: "",
    userInfo: {
      name: "张三",
      age: 18,
    },
  }),
  actions: {
    setToken(value: string) {
      console.log("设置token");
      this.token = value;
    },
    setIsLogin(value: boolean) {
      console.log("切换登录状态");
      this.isLogin = value;
    },
    setUserInfo({ name, age }: { name: string; age: number }) {
      console.log("设置用户信息");
      this.userInfo = {
        name,
        age,
      };
    },
  },
  persist: {
    key: "my_user_info", // localStorage 键名
    pick: ["isLogin", "userInfo"], // 只持久化某些字段
  },
});
