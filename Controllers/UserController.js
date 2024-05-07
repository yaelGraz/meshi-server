import UserModel from "../Models/UserModel.js";

const UserController={
    login: async(req,res)=>{                                    
       console.log("usercontroller")
       console.log("req",req.body)
       const { userName, password } = req.body;

       // Find user in the mock database
       try {
        const user = await UserModel.findOne({
          userName: userName,
          password: password
        });
        console.log("user:",user)
     
        if (user) {
          console.log("200")
          res.status(200).json({
            message: 'Login successful',
            user: {name:user.name,isAdmin:user.isAdmin}
          });
        } else {
          console.log("401")
          res.status(401).json({ message: 'Authentication failed' });
        }
      } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    },
    add:async(req,res)=>{
       try{
        console.log("name,userName,password:",req.body)
          const {name,userName,password,isAdmin}=req.body;
          const newUser = new UserModel({ name, userName,password ,isAdmin});
    
          // Save the new category to the database
          await newUser.save();
      
          console.log(`Added user "${name}" to the database`);
          res.status(201).json({ message: `User "${name}" added successfully` });
       }catch(error){
        res.status(500).json({message:error.message})
       }
    },

    get:async (req,res)=>{                                    
      console.log("usercontroller get")
      try{
       const users = await UserModel.find({});
       console.log("users:",users)
        res.send({users});
       } catch(e){
           res.status(400).json({message:e.message+UserModel})
       }  
   } ,
   update:async(req,res)=>{
    try {
      const userId = req.params.id; // Assuming the category ID is passed in the request parameters
      console.log("updateUser:",userId)
      console.log("req.body",req.body)
      console.log("updateUser")
      const { name, userName,password,isAdmin } = req.body;
  
      // Find the category by ID
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
  
      // Update the category properties
      user.name = name;
      user.userName=userName;
      user.password=password;
      user.isAdmin=isAdmin;
  
      await user.save();
  
      console.log(`Updated user with ID ${userId}`);
      res.status(200).json({ message: `User with ID ${userId} updated successfully` });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ message: error.message });
    }
  
      
   },
   delete:async (req,res)=>{
    try {
      const userId = req.params.id;
  
      // Find the category by its ID
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
   

      await UserModel.findByIdAndDelete(userId);
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
   }
}

export default UserController;