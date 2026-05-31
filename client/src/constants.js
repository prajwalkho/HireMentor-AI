

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  // csharp: "6.12.0",
  php: "8.2.3",
  c: "10.2.0",
  "c++": "10.2.0",
  bash: "5.2.0",
  go: "1.16.2",
  rust: "1.68.2",
  python2: "2.7.18",
  ruby:"3.0.1",
  dart: "2.19.6",
  kotlin: "1.8.20",
  swift:"5.3.3"
};

const currentUser = JSON.parse(localStorage.getItem("user"));

export const CODE_SNIPPETS = {
  javascript: `
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("${currentUser?.first_Name} ${currentUser?.last_Name}");
`,
  typescript: `
type Params = {
  name: string;
};

function greet(data: Params) {
  console.log("Hello, " + data.name + "!");
}

greet({ name: "${currentUser?.first_Name} ${currentUser?.last_Name}" });
`,
  python: `
def greet(name):
    print("Hello, " + name + "!")

greet("${currentUser?.first_Name} ${currentUser?.last_Name}")
`,
  java: `
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, ${currentUser?.first_Name} ${currentUser?.last_Name}!");
  }
}
`,
  php: `


$name = '${currentUser?.first_Name} ${currentUser?.last_Name}';
echo "Hello, " . $name . "!";
`,
  c: `
#include <stdio.h>

void greet(const char *name) {
    printf("Hello, %s!\n", name);
}

int main() {
    greet("${currentUser?.first_Name} ${currentUser?.last_Name}");
    return 0;
}
`,
  "c++": `
#include <iostream>
#include <string>

void greet(const std::string &name) {
    std::cout << "Hello, " << name << "!" << std::endl;
}

int main() {
    greet("${currentUser?.first_Name} ${currentUser?.last_Name}");
    return 0;
}
`,
  bash: `
#!/bin/bash

function greet() {
  echo "Hello, $1!"
}

greet "${currentUser?.first_Name} ${currentUser?.last_Name}"
`,
  go: `
package main

import "fmt"

func greet(name string) {
    fmt.Println("Hello, " + name + "!")
}

func main() {
    greet("${currentUser?.first_Name} ${currentUser?.last_Name}")
}
`,
  rust: `
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    greet("${currentUser?.first_Name} ${currentUser?.last_Name}");
}
`,
  python2: `
def greet(name):
    print "Hello, " + name + "!"

greet("${currentUser?.first_Name} ${currentUser?.last_Name}")
`,
  ruby: `
def greet(name)
  puts "Hello, #{name}!"
end

greet("${currentUser?.first_Name} ${currentUser?.last_Name}")
`,
  dart: `
void greet(String name) {
  print('Hello, $name!');
}

void main() {
  greet('${currentUser?.first_Name} ${currentUser?.last_Name}');
}
`,
  kotlin: `
fun greet(name: String) {
    println("Hello, $name!")
}

fun main() {
    greet("${currentUser?.first_Name} ${currentUser?.last_Name}")
}
`,
  swift: `
func greet(name: String) {
    print("Hello, \(name)!")
}

greet(name: "${currentUser?.first_Name} ${currentUser?.last_Name}")
`
};
