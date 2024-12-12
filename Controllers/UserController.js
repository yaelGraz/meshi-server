import UserModel from "../Models/UserModel.js";

const UserController={
    login: async(req,res)=>{                                    
       console.log("usercontroller")
       console.log("req",req.body)
       const { id_number, password } = req.body;

       // Find user in the mock database
       try {
        const user = await UserModel.findOne({
          id_number: id_number,
          password: password
        });
        console.log("user:",user)
        if (user) {
          res.status(200).json({
            message: 'Login successful',
            user: { id: user.id_mumber, id_number: user.id_number }
          });
        } else {
          res.status(401).json({ message: 'Authentication failed' });
        }
      } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    },

    get:async (req,res)=>{                                    
      console.log("usercontroller")
      try{
       const users = await UserModel.find({});
        res.send({users});
       } catch(e){
           res.status(400).json({message:e.message+UserModel})
       }  
   }  
}

export default UserController;