## Scratch User Verification API Specification
You should make a http request to https://obscure-inlet-57587.herokuapp.com/verify, with the following headers:  
`username`: The username of the user.  
`nonce`: The code that needs to be posted on the project.  
Then, a JSON response will be sent and the `valid` property (boolean) will indicate if the code is posted in the project.  
The project is [https://scratch.mit.edu/projects/318086755/](https://scratch.mit.edu/projects/318086755/).  
The code should be a random string, that is shown to the user and with a note indicating the code should be posted on [this](https://scratch.mit.edu/projects/318086755/) project.  
