# Can a small model perform relatively better with ReAct strategy

## The idea
One day I had a question. Can I make My own coding agent but then I thought everybody makes a coding agent. What are you going to do different? I took up a challenge to take a very small model (in this case `qwen3.5:0.8b`), albeit capable of thinking and reasoning, and wrap it with an orchestrator, give it primitive BREW (bash, read, edit, write) tools and see if it can design a landing page for itself. 

It would be a minor statement to say that it fucked up. It would straight on jump to coding without even looking or exploring the codebase. Okay that was my fault because I did not give it proper system prompts. All right let's give it a system prompt. 

```
Explore the codebase before editing, or creating any files. You have four tools:
- BASH to execute commands
- READ to read the files
- EDIT to edit an existing file with an exact string replace strategy
- WRITE to create a new file 
```

That should work so I thought. It was a devastation! It looked for the files, explored the project, read the files, AND it wrote an HTML file in a React project. Which mind you did not work. It did have content but was just a blank white page. Crazy amazing, absolutely what I needed. I tried to give it more specific system prompts and ended with a half implementation in React and half in HTML files, which again did not work.

Okay maybe it should make a plan before executing it. All right I added in the system prompt: 

```
make a plan before executing it.
```

It fucked up again. The plan itself did not have anything wrong in it. The execution, however, was absolute garbage. All right maybe I am doing something wrong. I went to the reasoning trace. I went to the reasoning blocks to understand what the model was going through and for some reason it would think in the correct direction and then "corrected" itself, which ended up being incorrect. Like it would think that `I need to create a TSX file with some contents in it` and then it would "correct" itself by thinking `I need, but the users said edit the files so I cannot create a typescript file and I should create an HTML file`. Like bro, two seconds ago you were on the right track. What just happened?

At this point I had just given up on it. I could not be bothered. I just left it and thought I will  come back to it later. 

## The comeback
After a few weeks I was reading a research paper on ReAct.
A very simplified explanation of ReAct: A reasoning-action looping strategy Where a model reasons over a given task, takes some action according to it's reasoning, observes the output of the action and keep on repeating until the task is completed. This apparently makes a model smarter relative to its baseline. 

I also read about Alfworld Which is an acronym for "Aligning Text and Embodied Environments for Interactive Learning". Simply put it's a benchmark for LLM models in which you are in a simulated environment and you are given a task and certain actions that you can take to complete the task.

After skimming through both of these I had a thought: will the Qwen model be able to solve this? 

## The baseline
I tried giving the Qwen model the task with the execution path to the Alfworld and it fucked up. It went on a recursive reasoning loop, which after a certain point became repetitive. It would think that it needed to do something. It would try it and it would understand that it was not possible and it needed to try a different thing but for some reason it would try the same thing again and repeat the same process over and over and over. I tried it several different times and got the same output every single time. The model was repeating itself without any leads.

## The first step
I gave the agent a proper system prompt with all the information that it needed on how to execute the task, what to expect, and what all tools it can use, with the descriptions for each tool. 

## The first success was too easy, or was it?
It did not take much before the agent was able to solve the first problem. Since the agent itself in a simulated environment was already in the kitchen, it was pretty easy for it to navigate to the fridge, open the fridge, take the apple, put it in the fridge.

The problem with this was that the agent was able to solve it but lied about how it solved it. It looked around for the apple as expected. It found the apple. It took the apple. It opened the fridge. It looked for the apple inside the fridge again. It found the apple somehow. It took the apple and it put it inside again. Pretty weird but that got fixed With some minor changes in the Alfworld rules for the agent.

## Making the task harder
All right so the agent was able to solve it with not much effort. So I decided to make the task harder for it. I first made another room for it to explore: introducing the living room.

The living room does not have anything. It does not have the apple. It does not have the fridge. It does not have anything but the agent can still look around the living room for things which do not exist.

The kitchen is still there. The apple is still in the kitchen. The fridge is still in the kitchen and the task is still the same: put the apple in the fridge. The twist is the agent is now in the living room that does not have anything useful, but the agent does not know that.

## How did it go?
Starting again the agent started by looking around the living room. It was trying to search for the apple and it was trying to search for the fridge. It obviously could not find it but the issue was the agent was not switching rooms. Why would it not switch rooms when it could neither find the apple nor the fridge? It was also surprising that the agent did not hallucinate the fridge or the apple, but it just kept on looking in a loop which kept going until it hit the recursion limit.

Here is the problem. For each step I was returning the observation, which was that the agent could not find the fridge nor the apple in the living room, which should be fine because it should prompt the agent to look for another step that it can execute other than look. The problem was that it was dumb enough to not understand that part. 

So what did I do? I passed every context that it needed. For every step that it took, I passed the task, the observations and the steps that it can validly take in that certain room.
For the living room it would be:
1. Look
2. Inventory
3. Go to the kitchen
For the kitchen it would be:
1. Look
2. Take the apple
3. Open the fridge
4. Put the apple in the fridge
It worked. The agent one-shotted the problem.

## Conclusion
This concludes one thing: that if given proper context through each repetition, the model is able to solve a task which it would previously fail without proper context. Now this does not mean that the model will be able to pass the landing page benchmark but it is at least a step in a correct direction, maybe. Will report back with another blog.


## Bibtext

```bibtex
@article{yao2022react,
  title={ReAct: Synergizing Reasoning and Acting in Language Models},
  author={Yao, Shunyu and Zhao, Jeffrey and Yu, Dian and Du, Nan and Shafran, Izhak and Narasimhan, Karthik and Cao, Yuan},
  journal={arXiv preprint arXiv:2210.03629},
  year={2022}
}
```
