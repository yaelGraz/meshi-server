import axios from "axios";

axios.defaults.baseURL=process.env.REACT_APP_apiAddress;

export default{
    getCategories: async () => {
        const result = await axios
          .get(``)
          .then((res) => {
            // return JSON.stringify(res.data.links);
            return res.data.categories;
          })
          .catch((e) => console.log(e));
           return result;
      },
}

