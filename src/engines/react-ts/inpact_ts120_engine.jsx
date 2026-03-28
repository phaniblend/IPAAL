import createINPACTEngine from "../inpact_engine_shared";
import { aiLessonToEngineConfig } from "../../ai-lessons/adapters/normalizeToEngineConfig.js";
import raw from "../../../content/react-ts/120_Creating_RTK_Endpoints_lesson.json";

const lesson = raw.config;
const engineConfig = aiLessonToEngineConfig(lesson, { track: "react-ts", language: "typescript" });

const INPACTEngineTS120 = createINPACTEngine(engineConfig);
export default INPACTEngineTS120;
