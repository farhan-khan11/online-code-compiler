import mongoose from "mongoose";
import '../dbConnect.js'
import dotenv from 'dotenv'
import Problem from "../models/Problems.js";
dotenv.config()

const problems = [
    { title: "Hello World", description: "Write a program that prints 'Hello, World!' to the console." },
    { title: "Sum of Two Numbers", description: "Take two numbers a=5 and b=10 and print their sum." },
    { title: "Even or Odd", description: "Check whether a given number n=7 is Even or Odd and print the result." },
    { title: "FizzBuzz", description: "Print numbers from 1 to 20. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz'." },
    { title: "Reverse a String", description: "Reverse the string 'hello' and print the result." },
    { title: "Factorial", description: "Find the factorial of n=5 and print the result." },
    { title: "Fibonacci Series", description: "Print the first 10 numbers of the Fibonacci series." },
    { title: "Count Vowels", description: "Count the number of vowels in the string 'hello world' and print the count." },
    { title: "Find Maximum", description: "Find the maximum number in the array [3, 7, 1, 9, 4, 6] and print it." },
    { title: "Palindrome Check", description: "Check if the string 'racecar' is a palindrome and print 'Yes' or 'No'." }
];

async function seedProblems() {
    try {
        await Problem.deleteMany({});
        console.log("Cleared existing problems")

        await Problem.insertMany(problems)
        console.log("Added 10 problems successfully")

        mongoose.connection.close();
    } catch (error) {
        console.log("seeding error !", error)
    }
}

seedProblems()