import { useState } from 'react'
import LandingPage from './LandingPage'
import { TS_FUNDAMENTALS_CURRICULUM } from './engines/typescript/inpact_tsf_index'
import { JS_FUNDAMENTALS_CURRICULUM } from './engines/javascript/inpact_jsf_index'
import { NODE_FUNDAMENTALS_CURRICULUM } from './engines/node/inpact_nodef_index'
import {
  ENGINES_JS_INTERVIEW,
  ENGINES_TS_INTERVIEW,
  ENGINES_NODE_INTERVIEW,
  JS_INTERVIEW_CURRICULUM,
  TS_INTERVIEW_CURRICULUM,
  NODE_INTERVIEW_CURRICULUM,
} from './engines/interview/interviewEngines'
import INPACTEngineTSF01 from './engines/typescript/inpact_tsf01_engine'
import INPACTEngineTSF02 from './engines/typescript/inpact_tsf02_engine'
import INPACTEngineTSF03 from './engines/typescript/inpact_tsf03_engine'
import INPACTEngineTSF04 from './engines/typescript/inpact_tsf04_engine'
import INPACTEngineTSF05 from './engines/typescript/inpact_tsf05_engine'
import INPACTEngineTSF06 from './engines/typescript/inpact_tsf06_engine'
import INPACTEngineTSF07 from './engines/typescript/inpact_tsf07_engine'
import INPACTEngineTSF08 from './engines/typescript/inpact_tsf08_engine'
import INPACTEngineTSF09 from './engines/typescript/inpact_tsf09_engine'
import INPACTEngineTSF10 from './engines/typescript/inpact_tsf10_engine'
import INPACTEngineJSF01 from './engines/javascript/inpact_jsf01_engine'
import INPACTEngineJSF02 from './engines/javascript/inpact_jsf02_engine'
import INPACTEngineJSF03 from './engines/javascript/inpact_jsf03_engine'
import INPACTEngineJSF04 from './engines/javascript/inpact_jsf04_engine'
import INPACTEngineJSF05 from './engines/javascript/inpact_jsf05_engine'
import INPACTEngineJSF06 from './engines/javascript/inpact_jsf06_engine'
import INPACTEngineJSF07 from './engines/javascript/inpact_jsf07_engine'
import INPACTEngineJSF08 from './engines/javascript/inpact_jsf08_engine'
import INPACTEngineJSF09 from './engines/javascript/inpact_jsf09_engine'
import INPACTEngineJSF10 from './engines/javascript/inpact_jsf10_engine'
import INPACTEngineJSF12 from './engines/javascript/inpact_jsf12_engine'
import INPACTEngineJSF13 from './engines/javascript/inpact_jsf13_engine'
import INPACTEngineJSF14 from './engines/javascript/inpact_jsf14_engine'
import INPACTEngineJSF15 from './engines/javascript/inpact_jsf15_engine'
import INPACTEngineNODEF01 from './engines/node/inpact_nodef01_engine'
import INPACTEngineJSF11 from './engines/JS/inpact_jsf11_engine'
import INPACTEngineJSB01 from './engines/JS/inpact_jsb01_engine'
import INPACTEngineJSB02 from './engines/JS/inpact_jsb02_engine'
import INPACTEngineJSB03 from './engines/JS/inpact_jsb03_engine'
import INPACTEngineJSB04 from './engines/JS/inpact_jsb04_engine'
import INPACTEngineJSB05 from './engines/JS/inpact_jsb05_engine'
import INPACTEngineJSB06 from './engines/JS/inpact_jsb06_engine'
import INPACTEngineJSC01 from './engines/JS/inpact_jsc01_engine'
import INPACTEngineJSC02 from './engines/JS/inpact_jsc02_engine'
import INPACTEngineJSC03 from './engines/JS/inpact_jsc03_engine'
import INPACTEngineJSC04 from './engines/JS/inpact_jsc04_engine'
import INPACTEngineJSC05 from './engines/JS/inpact_jsc05_engine'
import INPACTEngineJSD01 from './engines/JS/inpact_jsd01_engine'
import INPACTEngineP01 from './engines/inpact_p01_engine'
import INPACTEngineP02 from './engines/inpact_p02_engine'
import INPACTEngineP03 from './engines/inpact_p03_engine'
import INPACTEngineP04 from './engines/inpact_p04_engine'
import INPACTEngineP05 from './engines/inpact_p05_engine'
import INPACTEngineP06 from './engines/inpact_p06_engine'
import INPACTEngineP07 from './engines/inpact_p07_engine'
import INPACTEngineP08 from './engines/inpact_p08_engine'
import INPACTEngineP09 from './engines/inpact_p09_engine'
import INPACTEngineP10 from './engines/inpact_p10_engine'
import INPACTEngineP11 from './engines/inpact_p11_engine'
import INPACTEngineP12 from './engines/inpact_p12_engine'
import INPACTEngineP13 from './engines/inpact_p13_engine'
import INPACTEngineP14 from './engines/inpact_p14_engine'
import INPACTEngineP15 from './engines/inpact_p15_engine'
import INPACTEngineP16 from './engines/inpact_p16_engine'
import INPACTEngineP17 from './engines/inpact_p17_engine'
import INPACTEngineP18 from './engines/inpact_p18_engine'
import INPACTEngineP19 from './engines/inpact_p19_engine'
import INPACTEngineP20 from './engines/inpact_p20_engine'
import INPACTEngineP21 from './engines/inpact_p21_engine'
import INPACTEngineP22 from './engines/inpact_p22_engine'
import INPACTEngineP23 from './engines/inpact_p23_engine'
import INPACTEngineP24 from './engines/inpact_p24_engine'
import INPACTEngineP25 from './engines/inpact_p25_engine'
import INPACTEngineP26 from './engines/inpact_p26_engine'
import INPACTEngineP27 from './engines/inpact_p27_engine'
import INPACTEngineP28 from './engines/inpact_p28_engine'
import INPACTEngineP29 from './engines/inpact_p29_engine'
import INPACTEngineP30 from './engines/inpact_p30_engine'
import INPACTEngineTS01 from './engines/inpact_ts01_engine'
import INPACTEngineTS02 from './engines/inpact_ts02_engine'
import INPACTEngineTS03 from './engines/inpact_ts03_engine'
import INPACTEngineTS04 from './engines/inpact_ts04_engine'
import INPACTEngineTS05 from './engines/inpact_ts05_engine'
import INPACTEngineTS06 from './engines/inpact_ts06_engine'
import INPACTEngineTS07 from './engines/inpact_ts07_engine'
import INPACTEngineTS08 from './engines/inpact_ts08_engine'
import INPACTEngineTS09 from './engines/inpact_ts09_engine'
import INPACTEngineTS10 from './engines/inpact_ts10_engine'
import INPACTEngineTS11 from './engines/inpact_ts11_engine'
import INPACTEngineTS12 from './engines/inpact_ts12_engine'
import INPACTEngineTS13 from './engines/inpact_ts13_engine'
import INPACTEngineTS14 from './engines/inpact_ts14_engine'
import INPACTEngineTS15 from './engines/inpact_ts15_engine'
import INPACTEngineTS16 from './engines/inpact_ts16_engine'
import INPACTEngineTS17 from './engines/inpact_ts17_engine'
import INPACTEngineTS18 from './engines/inpact_ts18_engine'
import INPACTEngineTS19 from './engines/inpact_ts19_engine'
import INPACTEngineTS20 from './engines/inpact_ts20_engine'
import INPACTEngineTS21 from './engines/inpact_ts21_engine'
import INPACTEngineTS22 from './engines/inpact_ts22_engine'
import INPACTEngineTS23 from './engines/inpact_ts23_engine'
import INPACTEngineTS24 from './engines/inpact_ts24_engine'
import INPACTEngineTS25 from './engines/inpact_ts25_engine'
import INPACTEngineTS26 from './engines/inpact_ts26_engine'
import INPACTEngineTS27 from './engines/inpact_ts27_engine'
import INPACTEngineTS28 from './engines/inpact_ts28_engine'
import INPACTEngineTS29 from './engines/inpact_ts29_engine'
import INPACTEngineTS30 from './engines/inpact_ts30_engine'
import INPACTEngineP31 from './engines/inpact_p31_engine'
import INPACTEngineP32 from './engines/inpact_p32_engine'
import INPACTEngineP33 from './engines/inpact_p33_engine'
import INPACTEngineP34 from './engines/inpact_p34_engine'
import INPACTEngineP35 from './engines/inpact_p35_engine'
import INPACTEngineP36 from './engines/inpact_p36_engine'
import INPACTEngineP37 from './engines/inpact_p37_engine'
import INPACTEngineP38 from './engines/inpact_p38_engine'
import INPACTEngineP39 from './engines/inpact_p39_engine'
import INPACTEngineP40 from './engines/inpact_p40_engine'
import INPACTEngineP41 from './engines/inpact_p41_engine'
import INPACTEngineP42 from './engines/inpact_p42_engine'
import INPACTEngineP43 from './engines/inpact_p43_engine'
import INPACTEngineP44 from './engines/inpact_p44_engine'
import INPACTEngineP45 from './engines/inpact_p45_engine'
import INPACTEngineP46 from './engines/inpact_p46_engine'
import INPACTEngineP47 from './engines/inpact_p47_engine'
import INPACTEngineP48 from './engines/inpact_p48_engine'
import INPACTEngineP49 from './engines/inpact_p49_engine'
import INPACTEngineP50 from './engines/inpact_p50_engine'
import INPACTEngineP51 from './engines/inpact_p51_engine'
import INPACTEngineP52 from './engines/inpact_p52_engine'
import INPACTEngineP53 from './engines/inpact_p53_engine'
import INPACTEngineP54 from './engines/inpact_p54_engine'
import INPACTEngineP55 from './engines/inpact_p55_engine'
import INPACTEngineP56 from './engines/inpact_p56_engine'
import INPACTEngineP57 from './engines/inpact_p57_engine'
import INPACTEngineP58 from './engines/inpact_p58_engine'
import INPACTEngineP59 from './engines/inpact_p59_engine'
import INPACTEngineP60 from './engines/inpact_p60_engine'
import INPACTEngineP61 from './engines/inpact_p61_engine'
import INPACTEngineP62 from './engines/inpact_p62_engine'
import INPACTEngineP63 from './engines/inpact_p63_engine'
import INPACTEngineP64 from './engines/inpact_p64_engine'
import INPACTEngineP65 from './engines/inpact_p65_engine'
import INPACTEngineP66 from './engines/inpact_p66_engine'
import INPACTEngineP67 from './engines/inpact_p67_engine'
import INPACTEngineP68 from './engines/inpact_p68_engine'
import INPACTEngineP69 from './engines/inpact_p69_engine'
import INPACTEngineP70 from './engines/inpact_p70_engine'
import INPACTEngineP71 from './engines/inpact_p71_engine'
import INPACTEngineP72 from './engines/inpact_p72_engine'
import INPACTEngineP73 from './engines/inpact_p73_engine'
import INPACTEngineP74 from './engines/inpact_p74_engine'
import INPACTEngineP75 from './engines/inpact_p75_engine'
import INPACTEngineP76 from './engines/inpact_p76_engine'
import INPACTEngineP77 from './engines/inpact_p77_engine'
import INPACTEngineP78 from './engines/inpact_p78_engine'
import INPACTEngineP79 from './engines/inpact_p79_engine'
import INPACTEngineP80 from './engines/inpact_p80_engine'
import INPACTEngineP81 from './engines/inpact_p81_engine'
import INPACTEngineP82 from './engines/inpact_p82_engine'
import INPACTEngineP83 from './engines/inpact_p83_engine'
import INPACTEngineP84 from './engines/inpact_p84_engine'
import INPACTEngineP85 from './engines/inpact_p85_engine'
import INPACTEngineP86 from './engines/inpact_p86_engine'
import INPACTEngineP87 from './engines/inpact_p87_engine'
import INPACTEngineP88 from './engines/inpact_p88_engine'
import INPACTEngineP89 from './engines/inpact_p89_engine'
import INPACTEngineP90 from './engines/inpact_p90_engine'
import INPACTEngineP91 from './engines/inpact_p91_engine'
import INPACTEngineP92 from './engines/inpact_p92_engine'
import INPACTEngineP93 from './engines/inpact_p93_engine'
import INPACTEngineP94 from './engines/inpact_p94_engine'
import INPACTEngineP95 from './engines/inpact_p95_engine'
import INPACTEngineP96 from './engines/inpact_p96_engine'
import INPACTEngineP97 from './engines/inpact_p97_engine'
import INPACTEngineP98 from './engines/inpact_p98_engine'
import INPACTEngineP99 from './engines/inpact_p99_engine'
import INPACTEngineP100 from './engines/inpact_p100_engine'
import INPACTEngineTS31 from './engines/inpact_ts31_engine'
import INPACTEngineTS32 from './engines/inpact_ts32_engine'
import INPACTEngineTS33 from './engines/inpact_ts33_engine'
import INPACTEngineTS34 from './engines/inpact_ts34_engine'
import INPACTEngineTS35 from './engines/inpact_ts35_engine'
import INPACTEngineTS36 from './engines/inpact_ts36_engine'
import INPACTEngineTS37 from './engines/inpact_ts37_engine'
import INPACTEngineTS38 from './engines/inpact_ts38_engine'
import INPACTEngineTS39 from './engines/inpact_ts39_engine'
import INPACTEngineTS40 from './engines/inpact_ts40_engine'
import INPACTEngineTS41 from './engines/inpact_ts41_engine'
import INPACTEngineTS42 from './engines/inpact_ts42_engine'
import INPACTEngineTS43 from './engines/inpact_ts43_engine'
import INPACTEngineTS44 from './engines/inpact_ts44_engine'
import INPACTEngineTS45 from './engines/inpact_ts45_engine'
import INPACTEngineTS46 from './engines/inpact_ts46_engine'
import INPACTEngineTS47 from './engines/inpact_ts47_engine'
import INPACTEngineTS48 from './engines/inpact_ts48_engine'
import INPACTEngineTS49 from './engines/inpact_ts49_engine'
import INPACTEngineTS50 from './engines/inpact_ts50_engine'
import INPACTEngineTS51 from './engines/inpact_ts51_engine'
import INPACTEngineTS52 from './engines/inpact_ts52_engine'
import INPACTEngineTS53 from './engines/inpact_ts53_engine'
import INPACTEngineTS54 from './engines/inpact_ts54_engine'
import INPACTEngineTS55 from './engines/inpact_ts55_engine'
import INPACTEngineTS56 from './engines/inpact_ts56_engine'
import INPACTEngineTS57 from './engines/inpact_ts57_engine'
import INPACTEngineTS58 from './engines/inpact_ts58_engine'
import INPACTEngineTS59 from './engines/inpact_ts59_engine'
import INPACTEngineTS60 from './engines/inpact_ts60_engine'
import INPACTEngineTS61 from './engines/inpact_ts61_engine'
import INPACTEngineTS62 from './engines/inpact_ts62_engine'
import INPACTEngineTS63 from './engines/inpact_ts63_engine'
import INPACTEngineTS64 from './engines/inpact_ts64_engine'
import INPACTEngineTS65 from './engines/inpact_ts65_engine'
import INPACTEngineTS66 from './engines/inpact_ts66_engine'
import INPACTEngineTS67 from './engines/inpact_ts67_engine'
import INPACTEngineTS68 from './engines/inpact_ts68_engine'
import INPACTEngineTS69 from './engines/inpact_ts69_engine'
import INPACTEngineTS70 from './engines/inpact_ts70_engine'
import INPACTEngineTS71 from './engines/inpact_ts71_engine'
import INPACTEngineTS72 from './engines/inpact_ts72_engine'
import INPACTEngineTS73 from './engines/inpact_ts73_engine'
import INPACTEngineTS74 from './engines/inpact_ts74_engine'
import INPACTEngineTS75 from './engines/inpact_ts75_engine'
import INPACTEngineTS76 from './engines/inpact_ts76_engine'
import INPACTEngineTS77 from './engines/inpact_ts77_engine'
import INPACTEngineTS78 from './engines/inpact_ts78_engine'
import INPACTEngineTS79 from './engines/inpact_ts79_engine'
import INPACTEngineTS80 from './engines/inpact_ts80_engine'
import INPACTEngineTS81 from './engines/inpact_ts81_engine'
import INPACTEngineTS82 from './engines/inpact_ts82_engine'
import INPACTEngineTS83 from './engines/inpact_ts83_engine'
import INPACTEngineTS84 from './engines/inpact_ts84_engine'
import INPACTEngineTS85 from './engines/inpact_ts85_engine'
import INPACTEngineTS86 from './engines/inpact_ts86_engine'
import INPACTEngineTS87 from './engines/inpact_ts87_engine'
import INPACTEngineTS88 from './engines/inpact_ts88_engine'
import INPACTEngineTS89 from './engines/inpact_ts89_engine'
import INPACTEngineTS90 from './engines/inpact_ts90_engine'
import INPACTEngineTS91 from './engines/inpact_ts91_engine'
import INPACTEngineTS92 from './engines/inpact_ts92_engine'
import INPACTEngineTS93 from './engines/inpact_ts93_engine'
import INPACTEngineTS94 from './engines/inpact_ts94_engine'
import INPACTEngineTS95 from './engines/inpact_ts95_engine'
import INPACTEngineTS96 from './engines/inpact_ts96_engine'
import INPACTEngineTS97 from './engines/inpact_ts97_engine'
import INPACTEngineTS98 from './engines/inpact_ts98_engine'
import INPACTEngineTS99 from './engines/inpact_ts99_engine'
import INPACTEngineTS100 from './engines/inpact_ts100_engine'
import { ENGINES_VUE } from './engines/vue/inpact_vue_index'
import INPACTEngineAngularA01 from './engines/angular_a01_components'
import INPACTEngineAngularA02 from './engines/angular/angular_a02_data_binding'
import INPACTEngineAngularA03 from './engines/angular/angular_a03_services_di'
import INPACTEngineAngularA04 from './engines/angular/angular_a04_rxjs'
import INPACTEngineAngularA05 from './engines/angular/angular_a05_ngrx'
import INPACTEngineAngularA06 from './engines/angular/angular_a06_routing'
import INPACTEngineAngularA07 from './engines/angular/angular_a07_change_detection'
import INPACTEngineAngularA08 from './engines/angular/angular_a08_module_federation'
import INPACTEngineAngularA09 from './engines/angular/angular_a09_pipes'
import { ENGINES_ANGULAR_CURRICULUM } from './engines/angular/angular_curriculum_index'
import INPACTEngineC01 from './engines/css/inpact_c01_engine'
import INPACTEngineC02 from './engines/css/inpact_c02_engine'
import INPACTEngineC03 from './engines/css/inpact_c03_engine'
import INPACTEngineC04 from './engines/css/inpact_c04_engine'
import INPACTEngineC05 from './engines/css/inpact_c05_engine'
import INPACTEngineC06 from './engines/css/inpact_c06_engine'
import INPACTEngineC07 from './engines/css/inpact_c07_engine'
import INPACTEngineC08 from './engines/css/inpact_c08_engine'
import INPACTEngineC09 from './engines/css/inpact_c09_engine'
import INPACTEngineC10 from './engines/css/inpact_c10_engine'
import INPACTEngineC11 from './engines/css/inpact_c11_engine'
import INPACTEngineC12 from './engines/css/inpact_c12_engine'
import INPACTEngineC13 from './engines/css/inpact_c13_engine'
import INPACTEngineC14 from './engines/css/inpact_c14_engine'
import INPACTEngineC15 from './engines/css/inpact_c15_engine'
import INPACTEngineC16 from './engines/css/inpact_c16_engine'
import INPACTEngineC17 from './engines/css/inpact_c17_engine'
import INPACTEngineC18 from './engines/css/inpact_c18_engine'
import INPACTEngineC19 from './engines/css/inpact_c19_engine'
import INPACTEngineC20 from './engines/css/inpact_c20_engine'
import INPACTEngineC21 from './engines/css/inpact_c21_engine'
import INPACTEngineC22 from './engines/css/inpact_c22_engine'
import INPACTEngineC23 from './engines/css/inpact_c23_engine'
import INPACTEngineC24 from './engines/css/inpact_c24_engine'
import INPACTEngineC25 from './engines/css/inpact_c25_engine'
import INPACTEngineC26 from './engines/css/inpact_c26_engine'
import INPACTEngineC27 from './engines/css/inpact_c27_engine'
import INPACTEngineC28 from './engines/css/inpact_c28_engine'
import INPACTEngineC29 from './engines/css/inpact_c29_engine'
import INPACTEngineC30 from './engines/css/inpact_c30_engine'
import INPACTEngineC31 from './engines/css/inpact_c31_engine'
import INPACTEngineC32 from './engines/css/inpact_c32_engine'
import INPACTEngineC33 from './engines/css/inpact_c33_engine'
import INPACTEngineC34 from './engines/css/inpact_c34_engine'
import INPACTEngineC35 from './engines/css/inpact_c35_engine'
import INPACTEngineC36 from './engines/css/inpact_c36_engine'
import INPACTEngineC37 from './engines/css/inpact_c37_engine'
import INPACTEngineC38 from './engines/css/inpact_c38_engine'
import INPACTEngineC39 from './engines/css/inpact_c39_engine'
import INPACTEngineC40 from './engines/css/inpact_c40_engine'
import INPACTEngineC41 from './engines/css/inpact_c41_engine'
import INPACTEngineC42 from './engines/css/inpact_c42_engine'
import INPACTEngineC43 from './engines/css/inpact_c43_engine'
import INPACTEngineC44 from './engines/css/inpact_c44_engine'
import INPACTEngineC45 from './engines/css/inpact_c45_engine'
import INPACTEngineC46 from './engines/css/inpact_c46_engine'
import INPACTEngineC47 from './engines/css/inpact_c47_engine'
import INPACTEngineC48 from './engines/css/inpact_c48_engine'
import INPACTEngineC49 from './engines/css/inpact_c49_engine'
import INPACTEngineC50 from './engines/css/inpact_c50_engine'
import INPACTEngineC51 from './engines/css/inpact_c51_engine'
import INPACTEngineC52 from './engines/css/inpact_c52_engine'
import INPACTEngineC53 from './engines/css/inpact_c53_engine'
import INPACTEngineC54 from './engines/css/inpact_c54_engine'
import INPACTEngineC55 from './engines/css/inpact_c55_engine'
import INPACTEngineC56 from './engines/css/inpact_c56_engine'
import INPACTEngineC57 from './engines/css/inpact_c57_engine'
import INPACTEngineC58 from './engines/css/inpact_c58_engine'
import INPACTEngineC59 from './engines/css/inpact_c59_engine'
import INPACTEngineC60 from './engines/css/inpact_c60_engine'
import INPACTEngineC61 from './engines/css/inpact_c61_engine'
import INPACTEngineC62 from './engines/css/inpact_c62_engine'
import INPACTEngineC63 from './engines/css/inpact_c63_engine'
import INPACTEngineC64 from './engines/css/inpact_c64_engine'
import INPACTEngineC65 from './engines/css/inpact_c65_engine'
import INPACTEngineC66 from './engines/css/inpact_c66_engine'
import INPACTEngineC67 from './engines/css/inpact_c67_engine'
import INPACTEngineC68 from './engines/css/inpact_c68_engine'
import INPACTEngineC69 from './engines/css/inpact_c69_engine'
import INPACTEngineC70 from './engines/css/inpact_c70_engine'
import INPACTEngineC71 from './engines/css/inpact_c71_engine'
import INPACTEngineC72 from './engines/css/inpact_c72_engine'
import INPACTEngineC73 from './engines/css/inpact_c73_engine'
import INPACTEngineC74 from './engines/css/inpact_c74_engine'
import INPACTEngineC75 from './engines/css/inpact_c75_engine'
import INPACTEngineC76 from './engines/css/inpact_c76_engine'
import INPACTEngineC77 from './engines/css/inpact_c77_engine'
import INPACTEngineC78 from './engines/css/inpact_c78_engine'
import INPACTEngineC79 from './engines/css/inpact_c79_engine'
import INPACTEngineC80 from './engines/css/inpact_c80_engine'
import INPACTEngineC81 from './engines/css/inpact_c81_engine'
import INPACTEngineC82 from './engines/css/inpact_c82_engine'
import INPACTEngineC83 from './engines/css/inpact_c83_engine'
import INPACTEngineC84 from './engines/css/inpact_c84_engine'
import INPACTEngineC85 from './engines/css/inpact_c85_engine'
import INPACTEngineC86 from './engines/css/inpact_c86_engine'
import INPACTEngineC87 from './engines/css/inpact_c87_engine'
import INPACTEngineC88 from './engines/css/inpact_c88_engine'
import INPACTEngineC89 from './engines/css/inpact_c89_engine'
import INPACTEngineC90 from './engines/css/inpact_c90_engine'
import INPACTEngineC91 from './engines/css/inpact_c91_engine'
import INPACTEngineC92 from './engines/css/inpact_c92_engine'
import INPACTEngineC93 from './engines/css/inpact_c93_engine'
import INPACTEngineC94 from './engines/css/inpact_c94_engine'
import INPACTEngineC95 from './engines/css/inpact_c95_engine'
import INPACTEngineC96 from './engines/css/inpact_c96_engine'
import INPACTEngineC97 from './engines/css/inpact_c97_engine'
import INPACTEngineC98 from './engines/css/inpact_c98_engine'
import INPACTEngineC99 from './engines/css/inpact_c99_engine'
import INPACTEngineC100 from './engines/css/inpact_c100_engine'
import { CSS_CURRICULUM } from './engines/css/inpact_css_index'

const ENGINES = [
  INPACTEngineP01,
  INPACTEngineP02,
  INPACTEngineP03,
  INPACTEngineP04,
  INPACTEngineP05,
  INPACTEngineP06,
  INPACTEngineP07,
  INPACTEngineP08,
  INPACTEngineP09,
  INPACTEngineP10,
  INPACTEngineP11,
  INPACTEngineP12,
  INPACTEngineP13,
  INPACTEngineP14,
  INPACTEngineP15,
  INPACTEngineP16,
  INPACTEngineP17,
  INPACTEngineP18,
  INPACTEngineP19,
  INPACTEngineP20,
  INPACTEngineP21,
  INPACTEngineP22,
  INPACTEngineP23,
  INPACTEngineP24,
  INPACTEngineP25,
  INPACTEngineP26,
  INPACTEngineP27,
  INPACTEngineP28,
  INPACTEngineP29,
  INPACTEngineP30,
  INPACTEngineP31,
  INPACTEngineP32,
  INPACTEngineP33,
  INPACTEngineP34,
  INPACTEngineP35,
  INPACTEngineP36,
  INPACTEngineP37,
  INPACTEngineP38,
  INPACTEngineP39,
  INPACTEngineP40,
  INPACTEngineP41,
  INPACTEngineP42,
  INPACTEngineP43,
  INPACTEngineP44,
  INPACTEngineP45,
  INPACTEngineP46,
  INPACTEngineP47,
  INPACTEngineP48,
  INPACTEngineP49,
  INPACTEngineP50,
  INPACTEngineP51,
  INPACTEngineP52,
  INPACTEngineP53,
  INPACTEngineP54,
  INPACTEngineP55,
  INPACTEngineP56,
  INPACTEngineP57,
  INPACTEngineP58,
  INPACTEngineP59,
  INPACTEngineP60,
  INPACTEngineP61,
  INPACTEngineP62,
  INPACTEngineP63,
  INPACTEngineP64,
  INPACTEngineP65,
  INPACTEngineP66,
  INPACTEngineP67,
  INPACTEngineP68,
  INPACTEngineP69,
  INPACTEngineP70,
  INPACTEngineP71,
  INPACTEngineP72,
  INPACTEngineP73,
  INPACTEngineP74,
  INPACTEngineP75,
  INPACTEngineP76,
  INPACTEngineP77,
  INPACTEngineP78,
  INPACTEngineP79,
  INPACTEngineP80,
  INPACTEngineP81,
  INPACTEngineP82,
  INPACTEngineP83,
  INPACTEngineP84,
  INPACTEngineP85,
  INPACTEngineP86,
  INPACTEngineP87,
  INPACTEngineP88,
  INPACTEngineP89,
  INPACTEngineP90,
  INPACTEngineP91,
  INPACTEngineP92,
  INPACTEngineP93,
  INPACTEngineP94,
  INPACTEngineP95,
  INPACTEngineP96,
  INPACTEngineP97,
  INPACTEngineP98,
  INPACTEngineP99,
  INPACTEngineP100,
]

// TypeScript track: all 100 problems (ts01–ts100)
const ENGINES_TS = [
  INPACTEngineTS01,
  INPACTEngineTS02,
  INPACTEngineTS03,
  INPACTEngineTS04,
  INPACTEngineTS05,
  INPACTEngineTS06,
  INPACTEngineTS07,
  INPACTEngineTS08,
  INPACTEngineTS09,
  INPACTEngineTS10,
  INPACTEngineTS11,
  INPACTEngineTS12,
  INPACTEngineTS13,
  INPACTEngineTS14,
  INPACTEngineTS15,
  INPACTEngineTS16,
  INPACTEngineTS17,
  INPACTEngineTS18,
  INPACTEngineTS19,
  INPACTEngineTS20,
  INPACTEngineTS21,
  INPACTEngineTS22,
  INPACTEngineTS23,
  INPACTEngineTS24,
  INPACTEngineTS25,
  INPACTEngineTS26,
  INPACTEngineTS27,
  INPACTEngineTS28,
  INPACTEngineTS29,
  INPACTEngineTS30,
  INPACTEngineTS31,
  INPACTEngineTS32,
  INPACTEngineTS33,
  INPACTEngineTS34,
  INPACTEngineTS35,
  INPACTEngineTS36,
  INPACTEngineTS37,
  INPACTEngineTS38,
  INPACTEngineTS39,
  INPACTEngineTS40,
  INPACTEngineTS41,
  INPACTEngineTS42,
  INPACTEngineTS43,
  INPACTEngineTS44,
  INPACTEngineTS45,
  INPACTEngineTS46,
  INPACTEngineTS47,
  INPACTEngineTS48,
  INPACTEngineTS49,
  INPACTEngineTS50,
  INPACTEngineTS51,
  INPACTEngineTS52,
  INPACTEngineTS53,
  INPACTEngineTS54,
  INPACTEngineTS55,
  INPACTEngineTS56,
  INPACTEngineTS57,
  INPACTEngineTS58,
  INPACTEngineTS59,
  INPACTEngineTS60,
  INPACTEngineTS61,
  INPACTEngineTS62,
  INPACTEngineTS63,
  INPACTEngineTS64,
  INPACTEngineTS65,
  INPACTEngineTS66,
  INPACTEngineTS67,
  INPACTEngineTS68,
  INPACTEngineTS69,
  INPACTEngineTS70,
  INPACTEngineTS71,
  INPACTEngineTS72,
  INPACTEngineTS73,
  INPACTEngineTS74,
  INPACTEngineTS75,
  INPACTEngineTS76,
  INPACTEngineTS77,
  INPACTEngineTS78,
  INPACTEngineTS79,
  INPACTEngineTS80,
  INPACTEngineTS81,
  INPACTEngineTS82,
  INPACTEngineTS83,
  INPACTEngineTS84,
  INPACTEngineTS85,
  INPACTEngineTS86,
  INPACTEngineTS87,
  INPACTEngineTS88,
  INPACTEngineTS89,
  INPACTEngineTS90,
  INPACTEngineTS91,
  INPACTEngineTS92,
  INPACTEngineTS93,
  INPACTEngineTS94,
  INPACTEngineTS95,
  INPACTEngineTS96,
  INPACTEngineTS97,
  INPACTEngineTS98,
  INPACTEngineTS99,
  INPACTEngineTS100,
]

// TypeScript Fundamentals: 10 language-first problems (no React)
const ENGINES_TSF = [
  INPACTEngineTSF01,
  INPACTEngineTSF02,
  INPACTEngineTSF03,
  INPACTEngineTSF04,
  INPACTEngineTSF05,
  INPACTEngineTSF06,
  INPACTEngineTSF07,
  INPACTEngineTSF08,
  INPACTEngineTSF09,
  INPACTEngineTSF10,
]

// JavaScript Fundamentals: 10 language-first problems (no React)
const ENGINES_JSF = [
  INPACTEngineJSF01,
  INPACTEngineJSF02,
  INPACTEngineJSF03,
  INPACTEngineJSF04,
  INPACTEngineJSF05,
  INPACTEngineJSF06,
  INPACTEngineJSF07,
  INPACTEngineJSF08,
  INPACTEngineJSF09,
  INPACTEngineJSF10,
  INPACTEngineJSF12,
  INPACTEngineJSF13,
  INPACTEngineJSF14,
  INPACTEngineJSF15,
]

// Node.js Fundamentals: 1 problem (nodef01)
const ENGINES_NODE = [
  INPACTEngineNODEF01,
]

// JS Deep Dive: 13 problems (jsf11, jsb01–06, jsc01–05, jsd01)
const ENGINES_JS = [
  INPACTEngineJSF11,
  INPACTEngineJSB01,
  INPACTEngineJSB02,
  INPACTEngineJSB03,
  INPACTEngineJSB04,
  INPACTEngineJSB05,
  INPACTEngineJSB06,
  INPACTEngineJSC01,
  INPACTEngineJSC02,
  INPACTEngineJSC03,
  INPACTEngineJSC04,
  INPACTEngineJSC05,
  INPACTEngineJSD01,
]

// CSS — Module 1: Foundations (C01–C04)
const ENGINES_CSS = [
  INPACTEngineC01,
  INPACTEngineC02,
  INPACTEngineC03,
  INPACTEngineC04,
  INPACTEngineC05,
  INPACTEngineC06,
  INPACTEngineC07,
  INPACTEngineC08,
  INPACTEngineC09,
  INPACTEngineC10,
  INPACTEngineC11,
  INPACTEngineC12,
  INPACTEngineC13,
  INPACTEngineC14,
  INPACTEngineC15,
  INPACTEngineC16,
  INPACTEngineC17,
  INPACTEngineC18,
  INPACTEngineC19,
  INPACTEngineC20,
  INPACTEngineC21,
  INPACTEngineC22,
  INPACTEngineC23,
  INPACTEngineC24,
  INPACTEngineC25,
  INPACTEngineC26,
  INPACTEngineC27,
  INPACTEngineC28,
  INPACTEngineC29,
  INPACTEngineC30,
  INPACTEngineC31,
  INPACTEngineC32,
  INPACTEngineC33,
  INPACTEngineC34,
  INPACTEngineC35,
  INPACTEngineC36,
  INPACTEngineC37,
  INPACTEngineC38,
  INPACTEngineC39,
  INPACTEngineC40,
  INPACTEngineC41,
  INPACTEngineC42,
  INPACTEngineC43,
  INPACTEngineC44,
  INPACTEngineC45,
  INPACTEngineC46,
  INPACTEngineC47,
  INPACTEngineC48,
  INPACTEngineC49,
  INPACTEngineC50,
  INPACTEngineC51,
  INPACTEngineC52,
  INPACTEngineC53,
  INPACTEngineC54,
  INPACTEngineC55,
  INPACTEngineC56,
  INPACTEngineC57,
  INPACTEngineC58,
  INPACTEngineC59,
  INPACTEngineC60,
  INPACTEngineC61,
  INPACTEngineC62,
  INPACTEngineC63,
  INPACTEngineC64,
  INPACTEngineC65,
  INPACTEngineC66,
  INPACTEngineC67,
  INPACTEngineC68,
  INPACTEngineC69,
  INPACTEngineC70,
  INPACTEngineC71,
  INPACTEngineC72,
  INPACTEngineC73,
  INPACTEngineC74,
  INPACTEngineC75,
  INPACTEngineC76,
  INPACTEngineC77,
  INPACTEngineC78,
  INPACTEngineC79,
  INPACTEngineC80,
  INPACTEngineC81,
  INPACTEngineC82,
  INPACTEngineC83,
  INPACTEngineC84,
  INPACTEngineC85,
  INPACTEngineC86,
  INPACTEngineC87,
  INPACTEngineC88,
  INPACTEngineC89,
  INPACTEngineC90,
  INPACTEngineC91,
  INPACTEngineC92,
  INPACTEngineC93,
  INPACTEngineC94,
  INPACTEngineC95,
  INPACTEngineC96,
  INPACTEngineC97,
  INPACTEngineC98,
  INPACTEngineC99,
  INPACTEngineC100,
]

function getEngines(track) {
  if (track === 'js') return [...ENGINES_JSF, ...ENGINES_JS_INTERVIEW]
  if (track === 'ts') return [...ENGINES_TSF, ...ENGINES_TS_INTERVIEW]
  if (track === 'node') return [...ENGINES_NODE, ...ENGINES_NODE_INTERVIEW]
  if (track === 'react-ts') return ENGINES_TS
  if (track === 'angular')
    return [
      INPACTEngineAngularA01,
      INPACTEngineAngularA02,
      INPACTEngineAngularA03,
      INPACTEngineAngularA04,
      INPACTEngineAngularA05,
      INPACTEngineAngularA06,
      INPACTEngineAngularA07,
      INPACTEngineAngularA08,
      INPACTEngineAngularA09,
      ...ENGINES_ANGULAR_CURRICULUM,
    ]
  if (track === 'vue') return ENGINES_VUE
  if (track === 'css') return ENGINES_CSS
  return ENGINES
}

function getProblemList(track) {
  if (track === 'js') {
    const jsFund = JS_FUNDAMENTALS_CURRICULUM.map((c) => ({ title: c.title, shortName: c.shortName, why: c.why }))
    return [...jsFund, ...JS_INTERVIEW_CURRICULUM]
  }
  if (track === 'ts') {
    const tsFund = TS_FUNDAMENTALS_CURRICULUM.map((c) => ({ title: c.title, shortName: c.shortName, why: c.why }))
    return [...tsFund, ...TS_INTERVIEW_CURRICULUM]
  }
  if (track === 'node') {
    const nodeFund = NODE_FUNDAMENTALS_CURRICULUM.map((c) => ({ title: c.title, shortName: c.shortName, why: c.why }))
    return [...nodeFund, ...NODE_INTERVIEW_CURRICULUM]
  }
  if (track === 'css') {
    return CSS_CURRICULUM.map((c) => ({ title: c.title, shortName: c.shortName }))
  }
  if (track === 'angular' || track === 'vue') {
    return null // same 100 problem titles as React (PROBLEM_LIST in LandingPage)
  }
  return null // react-js and react-ts use PROBLEM_LIST from LandingPage (100 items)
}

export default function App() {
  const [track, setTrack] = useState('react-js') // 'react-js' | 'react-ts' | 'angular' | 'vue' | 'js' | 'ts' | 'node' | 'css'
  const [problemIndex, setProblemIndex] = useState(null) // null = landing, 0-based index = problem
  const onBackToProblems = () => setProblemIndex(null)

  if (problemIndex === null) {
    return (
      <LandingPage
        track={track}
        onTrackChange={setTrack}
        onSelectProblem={setProblemIndex}
        problemList={getProblemList(track)}
      />
    )
  }

  const engines = getEngines(track)
  const Engine = engines[problemIndex]
  const onNextProblem = () => setProblemIndex((i) => Math.min(i + 1, engines.length - 1))

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          padding: '10px 16px',
          background: 'rgba(13,17,23,0.95)',
          borderBottom: '1px solid #1e2733',
          borderRight: '1px solid #1e2733',
          borderBottomRightRadius: '8px',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <button
          type="button"
          onClick={onBackToProblems}
          style={{
            background: 'none',
            border: 'none',
            color: '#00d4ff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.05em',
          }}
        >
          ← All Problems
        </button>
      </div>
      <Engine
        onNextProblem={problemIndex < engines.length - 1 ? onNextProblem : undefined}
        onBackToProblems={onBackToProblems}
      />
    </>
  )
}