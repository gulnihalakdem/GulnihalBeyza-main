import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, getDocs, //lecture 1,,,, for lecture 3, getDocs is replaced by onSnapshot
    addDoc, deleteDoc, doc, //lecture 2
    onSnapshot, //lecture 3
    query, where, //lecture 4
    orderBy, serverTimestamp, //lecture 5
    getDoc, //lecture 6
    updateDoc //lecture 7
} from 'firebase/firestore';

import {
    getAuth, createUserWithEmailAndPassword, //lecture 8
    signOut, signInWithEmailAndPassword //lecture 9
} from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyAw1lJzMM_Osg9OYg8ceZyEuCYPUftX4Xk",
    authDomain: "sportkidsapp.firebaseapp.com",
    projectId: "sportkidsapp",
    storageBucket: "sportkidsapp.appspot.com",
    messagingSenderId: "560785087210",
    appId: "1:560785087210:web:121d564f9dad40feba9593",
    measurementId: "G-PYP682JRTE"
  };

initializeApp(firebaseConfig);
  
console.log("js File is working");

const db = getFirestore();
const auth = getAuth();

// CONTROL FUNCTIONS

// ageControl : birthdate should be at least 18 years ago and at most 100 years ago
function ageControlandAlert(birthdate, minAge, maxAge)
{
    const today = new Date();
    const birthdateDate = new Date(birthdate);
    let age = today.getFullYear() - birthdateDate.getFullYear();
    const month = today.getMonth() - birthdateDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthdateDate.getDate())) {
        age--;
    }
    if(age >= minAge && age <= maxAge)
    {
        return true;
    }
    else
    {
        alert("Age should be between " + minAge + " and " + maxAge + " years old");
        alert ("Try again");
        return false;
    }
}
function phoneControlandAlert(phone)
{
    if(phone.length == 11)
    {
        return true;
    }
    else
    {
        alert("Phone number should be 10 digits");
        alert ("Try again");
        return false;
    }
}
function IDControlandAlert(ID)
{
    if(ID.length == 11)
    {
        return true;
    }
    else
    {
        alert("ID should be 11 digits");
        alert ("Try again");
        return false;
    }
}

function controlAndAlertParent_Instructor(ID, birthdate, phone)
{
    // birth date should be between 18 and 100 years ago
    const ageControl = ageControlandAlert(birthdate, 18, 100);
    if(!ageControl) return false;
    // phone number should be 10 digits
    const phoneControl = phoneControlandAlert(phone);
    if(!phoneControl) return false;
    // ID should be 11 digits
    const IDControl = IDControlandAlert(ID);
    if(!IDControl) return false;    
    return true;
}
function controlAndAlertChild(ID, birthdate, weight, height)
{
    // birth date should be between 3 and 18 years ago
    const ageControl = ageControlandAlert(birthdate, 3, 18);
    if(!ageControl) return false;
    // weight should be between 10 and 100 kg
    if(weight < 10 || weight > 100)
    {
        alert("Weight should be between 10 and 100 kg");
        alert ("Try again");
        return false;
    }
    // height should be between 50 and 200 cm
    if(height < 50 || height > 200)
    {
        alert("Height should be between 50 and 200 cm");
        alert ("Try again");
        return false;
    }
    // ID should be 11 digits
    const IDControl = IDControlandAlert(ID);
    if(!IDControl) return false;    
    return true;
}
function controlAndAlertCourse(capacity, startDate, endDate, cost)
{
    // capacity should be between 10 and 100
    if(capacity < 10 || capacity > 100)
    {
        alert("Capacity should be between 10 and 100");
        alert ("Try again");
        return false;
    }
    // start date should be between today and 1 year later
    const today = new Date();
    const startDateDate = new Date(startDate);
    const endDateDate = new Date(endDate);

    console.log("today : " + today);
    console.log("startDateDate : " + startDateDate);
    console.log("endDateDate : " + endDateDate);

    if(startDateDate < today || startDateDate > endDateDate)
    {
        alert("Start date can not be after end date and should be between today and 1 year later");
        alert ("Try again");
        return false;
    }
    // end date should be between today and 1 year later
    if(endDateDate < today || endDateDate < startDateDate)
    {
        alert("End date can not be before start date and should be between today and 1 year later");
        alert ("Try again");
        return false;
    }
    // cost should be between 100 and 1000
    if(cost < 100 || cost > 1000)
    {
        alert("Cost should be between 100 and 1000");
        alert ("Try again");
        return false;
    }
    return true;
}

const adminRef = collection(db, 'adminInfos');

//There are 1 admin in the database, so we just take the data of the email and password and check if it is correct
//There should be an event listener for the form with class "login-cards"

const loginForm = document.querySelector('.login-cards');   

if(loginForm != null)
{
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        console.log("email : " + email);
        console.log("password : " + password);

        const querySnapshot = await getDocs(adminRef);
        querySnapshot.forEach(doc => {
            if (doc.data().email == email && doc.data().password == password) {
                console.log("Login successful");
                window.location.href = "adminHomePage.html";
            }
            else {
                console.log("Login unsuccessful");
                alert("Wrong email or password");
                //reload the page
                window.location.href = "logIn.html";

            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        
    });
}

// database reference for "parents" collection
const parentsRef = collection(db, 'parents');
// listen for parentAddForm submit event and add parent to the db

const parentAddForm = document.querySelector('.parentAddForm');

console.log("parentAddForm is something : " + parentAddForm);
//infos are : email, password, ID, name, surname, birthdate, phone, address from the form
// form inputs : input1, input2, input3, input4, input5, input6, input7, input8
// at the end, docid should be assigned to userID in the database (docid is the id of the document in the database)
// Adding a parent :
if(parentAddForm != null)
{
    parentAddForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = parentAddForm.input1.value;
        const password = parentAddForm.input2.value;
        const ID = parentAddForm.input3.value;
        const name = parentAddForm.input4.value;
        const surname = parentAddForm.input5.value;
        const birthdate = parentAddForm.input6.value;
        const phone = parentAddForm.input7.value;
        const address = parentAddForm.input8.value;

        // Some control on the inputs
        const parentControls = controlAndAlertParent_Instructor(ID, birthdate, phone)
        if(!parentControls) 
        {
            parentAddForm.reset();
            return;
        }

        const docRef = await addDoc(parentsRef, {
            email: email, // input1
            password: password, // input2
            ID: ID,
            name: name,
            surname: surname,
            birthdate: birthdate,
            phone: phone,
            address: address
        });
        console.log("Document written with ID: ", docRef.id);
        //assign docRef.id to userID in the database
        const parentDoc = doc(db, "parents", docRef.id);
        await updateDoc(parentDoc, {
            userID: docRef.id
        });
        console.log("userID is assigned to the document");
        //reset the form
        parentAddForm.reset();

        // ParentID copied to the clipboard automatically
        const copyText = docRef.id; 
        navigator.clipboard.writeText(copyText);
        alert("Parent added successfully and userID copied to the clipboard\nuserID : " + docRef.id);
    });
} 

// Removing a parent :
// listen for parentRemoveForm submit event and remove parent from the db
// infos are : userID from the form
// form inputs : input1
const parentRemoveForm = document.querySelector('.parentRemoveForm');

console.log("parentRemoveForm is something : " + parentRemoveForm);

if(parentRemoveForm != null)
{
    parentRemoveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userID = parentRemoveForm.input1.value;

        console.log("userID : " + userID);

        const parentDoc = doc(db, "parents", userID);
        if(parentDoc != null)
        {
            await deleteDoc(parentDoc);
            console.log("Parent successfully deleted");
            parentRemoveForm.reset();
        }
        else
        {
            console.log("Parent not found");
            alert("Parent not found");
            //reset the form
            parentRemoveForm.reset();
        }
    }
    );
}


// database reference for "children" collection
const childrenRef = collection(db, 'children');
// listen for childAddForm submit event and add child to the db

const childAddForm = document.querySelector('.childAddForm');

console.log("childAddForm is something : " + childAddForm);
//infos are : parentID, ID, name, surname, birthdate, weight, height from the form
// form inputs : input1, input2, input3, input4, input5, input6, input7

if(childAddForm != null)
{
    childAddForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const parentID = childAddForm.input1.value;
        const ID = childAddForm.input2.value;
        const name = childAddForm.input3.value;
        const surname = childAddForm.input4.value;
        const birthdate = childAddForm.input5.value;
        const weight = childAddForm.input6.value;
        const height = childAddForm.input7.value;

        // Some control on the inputs:
        // if parentID is not in the database, alert and reset the form
        const parentDoc = doc(db, "parents", parentID);
        const parentDocSnap = await getDoc(parentDoc);
        if(!parentDocSnap.exists())
        {
            alert("Parent not found");
            alert("Try again");
            childAddForm.reset();
            return;
        }
        
        const childControls = controlAndAlertChild(ID, birthdate, weight, height)
        if(!childControls) 
        {
            childAddForm.reset();
            return;
        }

        const docRef = await addDoc(childrenRef, {
            parentID: parentID, 
            ID: ID,
            name: name,
            surname: surname,
            birthdate: birthdate,
            weight: weight,
            height: height
        });
        console.log("Document written with ID: ", docRef.id);
        //assign docRef.id to userID in the database
        const childDoc = doc(db, "children", docRef.id);
        await updateDoc(childDoc, {
            userID: docRef.id
        });
        console.log("userID is assigned to the document");

        alert("Child added successfully\nPlease copy the userID in case you want to use it later\nuserID : " + docRef.id);
        //reset the form
        childAddForm.reset();
    });

}


// Removing a child :
// listen for childRemoveForm submit event and remove child from the db
// infos are : userID from the form
// form inputs : input1
const childRemoveForm = document.querySelector('.childRemoveForm');

console.log("childRemoveForm is something : " + childRemoveForm);

if(childRemoveForm != null)
{
    childRemoveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userID = childRemoveForm.input1.value;

        console.log("userID : " + userID);

        const childDoc = doc(db, "children", userID);
        if(childDoc != null)
        {
            await deleteDoc(childDoc);
            console.log("Child successfully deleted");
            childRemoveForm.reset();
        }
        else
        {
            console.log("Child not found");
            alert("Child not found");
            //reset the form
            childRemoveForm.reset();
        }
    }
    );
}


// database reference for "instructors" collection

const instructorsRef = collection(db, 'instructors');
// listen for instructorAddForm submit event and add instructor to the db

const instructorAddForm = document.querySelector('.instructorAddForm');

console.log("instructorAddForm is something : " + instructorAddForm);
//infos are : email, password, ID, name, surname, birthdate, phone, experiences from the form

if(instructorAddForm != null)
{
    instructorAddForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = instructorAddForm.input1.value;
        const password = instructorAddForm.input2.value;
        const ID = instructorAddForm.input3.value;
        const name = instructorAddForm.input4.value;
        const surname = instructorAddForm.input5.value;
        const birthdate = instructorAddForm.input6.value;
        const phone = instructorAddForm.input7.value;
        const experiences = instructorAddForm.input8.value;

        // Some control on the inputs
        const instructorControls = controlAndAlertParent_Instructor(ID, birthdate, phone)
        if(!instructorControls) 
        {
            instructorAddForm.reset();
            return;
        }

        const docRef = await addDoc(instructorsRef, {
            email: email, 
            password: password,
            ID: ID,
            name: name,
            surname: surname,
            birthdate: birthdate,
            phone: phone,
            experiences: experiences
        });
        console.log("Document written with ID: ", docRef.id);
        //assign docRef.id to userID in the database
        const instructorDoc = doc(db, "instructors", docRef.id);
        await updateDoc(instructorDoc, {
            userID: docRef.id
        });
        console.log("userID is assigned to the document");

        //copy userID to the clipboard
        const copyText = docRef.id;
        navigator.clipboard.writeText(copyText);
        alert("Instructor added successfully and userID copied to the clipboard\nuserID : " + docRef.id);
        //reset the form
        instructorAddForm.reset();
    });

}

// Removing an instructor :
// listen for instructorRemoveForm submit event and remove instructor from the db
// infos are : userID from the form
// form inputs : input1
const instructorRemoveForm = document.querySelector('.instructorRemoveForm');

console.log("instructorRemoveForm is something : " + instructorRemoveForm);

if(instructorRemoveForm != null)
{
    instructorRemoveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userID = instructorRemoveForm.input1.value;

        console.log("userID : " + userID);

        const instructorDoc = doc(db, "instructors", userID);
        if(instructorDoc != null)
        {
            await deleteDoc(instructorDoc);
            console.log("Instructor successfully deleted");
            instructorRemoveForm.reset();
        }
        else
        {
            console.log("Instructor not found");
            alert("Instructor not found");
            //reset the form
            instructorRemoveForm.reset();
        }
    }
    );
}

// database reference for "courses" collection

const coursesRef = collection(db, 'courses');
// listen for courseAddForm submit event and add course to the db

const courseAddForm = document.querySelector('.courseAddForm');

console.log("courseAddForm is something : " + courseAddForm);
//infos are : instructorID, courseName, capacity, startDate, endDate, coursePlace, cost
// form inputs : input1, input2, input3, input4, input5, input6, input7

if(courseAddForm != null)
{
    courseAddForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const instructorID = courseAddForm.input1.value;
        const courseName = courseAddForm.input2.value;
        const capacity = courseAddForm.input3.value;
        const startDate = courseAddForm.input4.value;
        const endDate = courseAddForm.input5.value;
        const coursePlace = courseAddForm.input6.value;
        const cost = courseAddForm.input7.value;

        // Some control on the inputs:

        // if instructorID is not in the database, alert and reset the form
        const instructorDoc = doc(db, "instructors", instructorID);
        const instructorDocSnap = await getDoc(instructorDoc);
        if(!instructorDocSnap.exists())
        {
            alert("Instructor not found");
            alert("Try again");
            courseAddForm.reset();
            return;
        }

        const courseControls = controlAndAlertCourse(capacity, startDate, endDate, cost)
        if(!courseControls)
        {
            courseAddForm.reset();
            return;
        }

        const docRef = await addDoc(coursesRef, {
            instructorID: instructorID, 
            courseName: courseName,
            capacity: capacity,
            startDate: startDate,
            endDate: endDate,
            coursePlace: coursePlace,
            cost: cost
        });
        console.log("Document written with ID: ", docRef.id);
        //assign docRef.id to userID in the database
        const courseDoc = doc(db, "courses", docRef.id);
        await updateDoc(courseDoc, {
            userID: docRef.id
        });
        console.log("userID is assigned to the document");

        alert("Course added successfully\nPlease copy the userID in case you want to use it later\nuserID : " + docRef.id);
        //reset the form
        courseAddForm.reset();
    });

}

// Removing a course :
// listen for courseRemoveForm submit event and remove course from the db
// infos are : userID from the form
// form inputs : input1
const courseRemoveForm = document.querySelector('.courseRemoveForm');

console.log("courseRemoveForm is something : " + courseRemoveForm);

if(courseRemoveForm != null)
{
    courseRemoveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userID = courseRemoveForm.input1.value;

        console.log("userID : " + userID);

        const courseDoc = doc(db, "courses", userID);
        if(courseDoc != null)
        {
            await deleteDoc(courseDoc);
            console.log("Course successfully deleted");
            courseRemoveForm.reset();
        }
        else
        {
            console.log("Course not found");
            alert("Course not found");
            //reset the form
            courseRemoveForm.reset();
        }
    }
    );
}

// Add an announcement : from adminHomePageForm
// listen for adminHomePageForm submit event and add announcement to the db
// infos are : announcement from the form
// form inputs : input1
// important : announcement should be deleted after 1 week
const adminHomePageForm = document.querySelector('.adminHomePageForm');

console.log("adminHomePageForm is something : " + adminHomePageForm);

if(adminHomePageForm != null)
{
    adminHomePageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const announcement = adminHomePageForm.input1.value;

        console.log("announcement : " + announcement);

        const docRef = await addDoc(adminRef, {
            announcement: announcement
        });
        console.log("Document written with ID: ", docRef.id);
        //reset the form
        adminHomePageForm.reset();
    }
    );
}


