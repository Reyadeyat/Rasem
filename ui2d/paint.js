/*
 * Copyright (C) 2023-2024 Reyadeyat
 * All Rights Reserved.
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://reyadeyat.net/LICENSE/REYADEYAT.LICENSE
 * 
 * This License permits the use, modification, and distribution of the code
 * under the terms specified in the License document.
 */

"use strict";

import { Log } from '@reyadeyat/haseb'

export class Paint {

    constructor(json_configuration_file) {
        this.json_configuration_file = json_configuration_file;
        this.container_id = this.json_configuration_file.container_id;
        this.log_level_name = this.json_configuration_file.log_level_name;
        Log.setLogLevel(this.log_level_name);
    }

}
