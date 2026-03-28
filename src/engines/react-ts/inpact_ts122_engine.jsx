import createINPACTEngine from "../inpact_engine_shared";
import { aiLessonToEngineConfig } from "../../ai-lessons/adapters/normalizeToEngineConfig.js";
import raw from "../../../content/react-ts/122_Building_createAsyncThunk_lesson.json";

const lesson = raw.config;
const engineConfig = aiLessonToEngineConfig(lesson, { track: "react-ts", language: "typescript" });

const INPACTEngineTS122 = createINPACTEngine(engineConfig);
export default INPACTEngineTS122;
