/*
 * Copyright 2015-2016 Imply Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Q from 'q';
import { Timezone } from "chronoshift";
import { Expression, Datum, RefExpression, PlywoodValue, SQLParse } from "plywood";

function upperCaseRefs(expression: Expression): Expression {
  return expression.substitute((ex) => {
    if (ex instanceof RefExpression) {
      var v = ex.valueOf();
      v.name = v.name.toUpperCase();
      return new RefExpression(v);
    }
    return null;
  })
}

export function executeSQLParse(sqlParse: SQLParse, context: Datum, timezone: Timezone): Q.Promise<PlywoodValue> {
  var { expression, database } = sqlParse;
  if (database && database.toLowerCase() === 'information_schema') {
    expression = upperCaseRefs(expression); // the context variables are hardcoded from plyql so it makes sense to force upper here.
  }

  return expression.compute(context, { timezone });
}

export function executePlywood(expression: Expression, context: Datum, timezone: Timezone): Q.Promise<PlywoodValue> {
  return expression.compute(context, { timezone });
}
