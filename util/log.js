/*
 * Copyright (C) 2023 - 2024 Reyadeyat
 *
 * Reyadeyat/Rasem is licensed under the
 * BSD 3-Clause "New" or "Revised" License
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://reyadeyat.net/LICENSE/RASEM.LICENSE
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class Log {
    
    static FATAL = 990;
    static fatal(msg, ...args) {
        if (Log.log_level > Log.FATAL) {
            return;
        }
        console.info("FATAL: " + msg + Log.dump(...args));
    }
    
    static ERROR = 890;
    static error(msg, ...args) {
        if (Log.log_level > Log.ERROR) {
            return;
        }
        console.info("ERROR: " + msg + Log.dump(...args));
    }
    
    static WARNING = 790;
    static warning(msg, ...args) {
        if (Log.log_level > Log.WARNING) {
            return;
        }
        console.info("WARNING: " + msg + Log.dump(...args));
    }
    
    static INFO = 690;
    static info(msg, ...args) {
        if (Log.log_level > Log.INFO) {
            return;
        }
        console.info("INFO: " + msg + Log.dump(...args));
    }

    static DEBUG = 590;
    static debug(msg, ...args) {
        if (Log.log_level > Log.DEBUG) {
            return;
        }
        console.info("DEBUG: " + msg + Log.dump(...args));
    }
    
    static DEBUG_LOGIC = 580;
    static debug_logic(msg, ...args) {
        if (Log.log_level > Log.DEBUG_LOGIC) {
            return;
        }
        console.info("DEBUG_LOGIC: " + msg + Log.dump(...args));
    }
    
    static DEBUG_DATA = 570;
    static debug_data(msg, ...args) {
        if (Log.log_level > Log.DEBUG_DATA) {
            return;
        }
        console.info("DEBUG_DATA: " + msg + Log.dump(...args));
    }
    
    static TRACE = 490;
    static trace(msg, ...args) {
        if (Log.log_level > Log.TRACE) {
            return;
        }
        console.info("TRACE: " + msg + Log.dump(...args));
    }
    
    static TRACE_LOGIC = 480;
    static trace_logic(msg, ...args) {
        if (Log.log_level > Log.TRACE_LOGIC) {
            return;
        }
        console.info("TRACE_LOGIC: " + msg + Log.dump(...args));
    }
    
    static TRACE_DATA = 470;
    static trace_data(msg, ...args) {
        if (Log.log_level > Log.TRACE_DATA) {
            return;
        }
        console.info("TRACE_DATA: " + msg + Log.dump(...args));
    }

    static log_level = Log.info;
    static log_level(log_level) {
        Log.log_level = log_level;
    }

    static is(log_level) {
        return Log.log_level == log_level;
    }

    static getLogLevel(log_level_name) {
        switch (log_level_name.toUpperCase()) {
            case 'FATAL': return Log.FATAL;
            case 'ERROR': return Log.ERROR;
            case 'WARNING': return Log.WARNING;
            case 'INFO': return Log.INFO;
            case 'DEBUG': return Log.DEBUG;
            case 'DEBUG_LOGIC': return Log.DEBUG_LOGIC;
            case 'DEBUG_DATA': return Log.DEBUG_DATA;
            case 'TRACE': return Log.TRACE;
            case 'TRACE_LOGIC': return Log.TRACE_LOGIC;
            case 'TRACE_DATA': return Log.TRACE_DATA;
        }
        throw new Error("Undefined Log Level '" + log_level_name.toUpperCase() + "'");
    }

    static setLogLevel(log_level_name) {
        Log.log_level = Log.getLogLevel(log_level_name);       
    }

    static dump(...args) {
        if (args == null || args.length == 0) {
            return "";
        }
        let obj = {};
        let key = args[0].split(",");
        for (let i = 1; i < args.length; i++) {
            obj[key[i-1].trim()] = args[i];
        }
        return JSON.stringify(obj);
    }
}