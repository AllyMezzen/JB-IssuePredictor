# Issue Predictor 🔄

## Project description

This project presents a script that fills all `Subsystem` fields with the usage of ChatGPT API. 
System works with two input files - `input.json` and `input_reference.json` (for success rate calculation).

## How to get started

Step 1: Download repo and unzip file.

Step 2: Run `npm install`.

Step 3: Open .env file and add two keys - 

```
REACT_APP_ORGANIZATION_KEY= {ChatGPT organization id}
REACT_APP_API_KEY= {ChatGPT api key}
```

Step 4: Run `ts-node src/main.ts`.

The processing of data is shown in console. The result is stored in an `output.json` file.

## Result

*Input:* 100 issues from YouTrack (empty `Subsystem` field).

*Output:* 100 issues with `Subsystem` field filled by **ChatGPT ver3.5**.

Received success suggestion ratio (after processing 100 issues) is **71%** ☑️

![](/public/resultofissuepredictor.png)
