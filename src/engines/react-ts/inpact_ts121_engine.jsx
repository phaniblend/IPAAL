import createINPACTEngine from "../inpact_engine_shared";
import { aiLessonToEngineConfig } from "../../ai-lessons/adapters/normalizeToEngineConfig.js";
import raw from "../../../content/react-ts/121_Query_Building_in_RTK_lesson.json";

const lesson = raw.config;
const engineConfig = aiLessonToEngineConfig(lesson, { track: "react-ts", language: "typescript" });

const INPACTEngineTS121 = createINPACTEngine(engineConfig);
export default INPACTEngineTS121;
