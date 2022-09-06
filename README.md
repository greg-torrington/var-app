# Approval adjusted VaR analyser
This tool, a product by FLOAT, calculates a contracts approval adjusted VaR at a given point
in time according to an ERC20 token. The program functions by allowing
an ERC20 address to be entered, the specific contracts address to be
entered, and a list of user addresses by either a CSV file or a comma seperated
list. The VaR is then calcualted.

# Built with
This application was built with by the following features:

    1.  react
    2.  tailwind 
    3.  ethers js

# Run the app
    1. Clone the repo (will need npm, ethers js, craco installed locally/globally): 
        https://github.com/greg-torrington/var-app.git
    
    2. Run application: 
        npm start

# Usage
Below will be a step by step on how to use the application to its full potential:
    
    1.  Enter correct data into the first three inputs provided, the first input box is to connect to a network node, this is a select box but can be changed to an input text field by selecting 'other' if the required node is not listed. The second input is an input text field, this is for the ERC20 token address, the third input is for the contract address. 

    2.  Once relevant data has been entered in the 3 fields, select a blue label depending on how you want to enter user address data. 
        - If user addresses are stored in a CSV file, select the blue link labeled as,"ADD USER ADDRESSES AS CSV FILE.". Select the "Choose file" button to submit the csv file, it must be stored in your library, press "Submit".

        - User addresses can also be inputted as a comma seperated list by selecting the label, "ADD USER ADDRESSES AS COMMA SEPERATED LIST.". This will allow the data to be entered into an input text field, the comma separated list cannot have any spaces.

    3.  Once all data has been entered, only then can the user select the button "Calculate VaR" for it to have an effect. A loading spinner will replace the button until the VaR amount is displayed below the FLOAT logo with a figure. If not all data has been entered, a relevant error message will be displayed on the UI indicating which input field does not have information.

    4.  A label marked as "SEE USERS LOGS" will be displayed in the bottom left corner once VaR has been calculated. Selecting this label will display a table with user addresses and their corresponding allowance and balance, this table will replace the input page.

    5.  An explainer tool button with text, "?", is displayed in the top right hand corner. Selecting this button will direct to a page explaining how to use the application to its full potential. 

    6.  Labels marked with "BACK" which are displayed on the explainer tool and user logs pages, in the top left hand corner, will direct you back to the VaR calculating page with information you have previously entered still recorded.

    7.  Lastly, the "RESET" label displayed will set the webpage back to its default setting whenever pressed.

# Further work
Further work to be done:

    1.  Error catch statements for when the user enters an incorrect address or node url.
    
    2.  Use approval events, from chosen contract, to get list of users. Could be more complex and under performant. 