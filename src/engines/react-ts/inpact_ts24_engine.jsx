import createINPACTEngine from "../inpact_engine_shared";
import { aiLessonToEngineConfig } from "../../ai-lessons/adapters/normalizeToEngineConfig.js";
import raw from "../../../content/react-ts/024_Simple_Todo_List_lesson.json";

const lesson = raw.config;
const engineConfig = aiLessonToEngineConfig(lesson, { track: "react-ts", language: "typescript" });

const INPACTEngineTS24 = createINPACTEngine(engineConfig);
export default INPACTEngineTS24;
