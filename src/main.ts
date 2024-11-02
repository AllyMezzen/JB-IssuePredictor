import * as fs from 'fs';
import {OpenAI} from 'openai';

const CURRENT_GPT_MODEL = 'gpt-3.5-turbo'
const COMPANY_NAME = "JetBrains"
const FIELD_TO_FILL = "Subsystem"
const DEFAULT_VALUE = "No Subsystem"
const DATASET_SIZE = 4

const client = new OpenAI({
    dangerouslyAllowBrowser: true,
    organization: "org-1L9GCAoNZgyooGBnMJ8FGxsq",
    apiKey: "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",
});

const input_to_fill = JSON.parse(fs.readFileSync('./testData/input.json', 'utf-8'));
const input_reference = JSON.parse(fs.readFileSync('./testData/input_reference.json', 'utf-8'));

const subsystemValues = ["Issue list", "Frameworks. Lombok", "No Subsystem", "Settings", "--", "Debugger: GDB", "Code Analysis", "Context Navigation", "* Unspecified *", "Code Completion", "Java. Decompiler", "i18n", "UI", "Code Style - Cleanup", "Database and SQL", "R", "Debugger", "Inspections", "Home", "Unit Testing", "UI. Actions and Focus", "IntelliJ BSP plugin", "IDE", "AI Chat", "Editor. Editing Text", "Run-Debug", "Console: Terminal", "Intentions, Inspections"];

let rightPredictionCount = 0

const filterNullableValue = (item: any): any => {
    let result: any = {}
    Object.keys(item).map(key => {
        if (item[key] !== null && item[key] !== undefined) {
            result[key] = item[key]
        }
    })
    return result
}

/**
 * Fill the [FIELD_TO_FILL] field using ChatGPT
 * @param item - The JSON object to process
 * @returns Suggested FIELD_TO_FILL value
 */
async function fillSubsystemField(item: any): Promise<string> {
    const prompt = `
                Given the following issue data from ${COMPANY_NAME} company:
                ${JSON.stringify(filterNullableValue(item))}
                
                Try to analyze problem and find according ${FIELD_TO_FILL} values only from list: ${subsystemValues.join(',')}
                
                Provide only the ${FIELD_TO_FILL} value. Output should be strictly one of the ${FIELD_TO_FILL} values.
                `;

    const response = await client.chat.completions.create({
        messages: [{role: 'user', content: prompt}],
        model: CURRENT_GPT_MODEL,
    })

    const value = response.choices[0].message.content
    if (value && subsystemValues.includes(value)) {
        return value
    } else {
        return DEFAULT_VALUE
    }
}

async function main() {
    for (let i = 0; i < DATASET_SIZE; i++) {
        const item = input_to_fill[i]
        const referenceItem = input_reference[i]
        try {
            item[FIELD_TO_FILL] = await fillSubsystemField(item);
            if (item[FIELD_TO_FILL].trim() === referenceItem[FIELD_TO_FILL].trim()) {
                rightPredictionCount++
            }
            console.log(`Processed issue with ID ${item['Issue Id']}: ${FIELD_TO_FILL} proposal to '${item[FIELD_TO_FILL]}'. Actual value ${referenceItem[FIELD_TO_FILL]}`);
        } catch (error) {
            console.error(`Error processing item with ID ${item['Issue Id']}:`, error);
        }
    }
    console.log(rightPredictionCount / DATASET_SIZE * 100 + "% precision");

    fs.writeFileSync('output.json', JSON.stringify(input_to_fill), 'utf-8');
}

main();
