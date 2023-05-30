import { t, validateNonEmpty } from "@superset-ui/core";
import {
  ControlPanelConfig,
  sections,
  sharedControls,
} from "@superset-ui/chart-controls";

const config: ControlPanelConfig = {
  /**
   * The control panel is split into two tabs: "Query" and
   * "Chart Options". The controls that define the inputs to
   * the chart data request, such as columns and metrics, usually
   * reside within "Query", while controls that affect the visual
   * appearance or functionality of the chart are under the
   * "Chart Options" section.
   * Панель управления разделена на две вкладки: "Запрос" и
* "Параметры диаграммы". Элементы управления, которые определяют входные данные для
* запрос данных диаграммы, таких как столбцы и метрики, обычно
* находиться в "Запросе", в то время как элементы управления, влияющие на визуальный
* внешний вид или функциональность диаграммы находятся под
* Раздел "Параметры диаграммы".
   *
   * There are several predefined controls that can be used.
   * Some examples:
   * - groupby: columns to group by (tranlated to GROUP BY statement)
   * - series: same as groupby, but single selection.
   * - metrics: multiple metrics (translated to aggregate expression)
   * - metric: sane as metrics, but single selection
   * - adhoc_filters: filters (translated to WHERE or HAVING
   *   depending on filter type)
   * - row_limit: maximum number of rows (translated to LIMIT statement)
   *Существует несколько предопределенных элементов управления, которые можно использовать.
* Несколько примеров:
* - groupby: столбцы для группировки по (переведено в оператор GROUP BY)
* - серия: такая же, как groupby, но с одним выбором.
* - метрики: несколько метрик (переведенных в агрегированное выражение)
* - метрика: нормальная как метрика, но одиночный выбор
* - adhoc_filters: фильтры (переведенные КУДА или ИМЕЮЩИЕ
* в зависимости от типа фильтра)
* - row_limit: максимальное количество строк (переведено в оператор LIMIT)
   * 
   * If a control panel has both a `series` and `groupby` control, and
   * the user has chosen `col1` as the value for the `series` control,
   * and `col2` and `col3` as values for the `groupby` control,
   * the resulting query will contain three `groupby` columns. This is because
   * we considered `series` control a `groupby` query field and its value
   * will automatically append the `groupby` field when the query is generated.
   *
   * It is also possible to define custom controls by importing the
   * necessary dependencies and overriding the default parameters, which
   * can then be placed in the `controlSetRows` section
   * of the `Query` section instead of a predefined control.
   *Также возможно определить пользовательские элементы управления, импортировав
* необходимые зависимости и переопределение параметров по умолчанию, которые
* * затем может быть помещен в раздел `controlSetRows`
* из раздела `Запрос` вместо предопределенного элемента управления.
   * 
   * import { validateNonEmpty } from '@superset-ui/core';
   * import {
   *   sharedControls,
   *   ControlConfig,
   *   ControlPanelConfig,
   * } from '@superset-ui/chart-controls';
   *
   * const myControl: ControlConfig<'SelectControl'> = {
   *   name: 'secondary_entity',
   *   config: {
   *     ...sharedControls.entity,
   *     type: 'SelectControl',
   *     label: t('Secondary Entity'),
   *     mapStateToProps: state => ({
   *       sharedControls.columnChoices(state.datasource)
   *       .columns.filter(c => c.groupby)
   *     })
   *     validators: [validateNonEmpty],
   *   },
   * }
   *
   * In addition to the basic drop down control, there are several predefined
   * control types (can be set via the `type` property) that can be used. Some
   * commonly used examples:
   * - SelectControl: Dropdown to select single or multiple values,
       usually columns
   * - MetricsControl: Dropdown to select metrics, triggering a modal
       to define Metric details
   * - AdhocFilterControl: Control to choose filters
   * - CheckboxControl: A checkbox for choosing true/false values
   * - SliderControl: A slider with min/max values
   * - TextControl: Control for text data
   *В дополнение к базовому раскрывающемуся элементу управления существует несколько предопределенных
* типы элементов управления (могут быть установлены с помощью свойства `type`), которые можно использовать. Некоторые
* часто используемые примеры:
* - * - Выберите элемент управления: Выпадающий список для выбора одного или нескольких значений,
обычно столбцов
* - * - Управление метриками: Выпадающий список для выбора метрик, запускающий модальный
для определения деталей метрики
* - * - Управление специальным фильтром: Управление для выбора фильтров
* - * - Контроль флажка: Флажок для выбора значений true/false
* - * - Управление ползунком: ползунок с минимальными/максимальными значениями
* - * - Управление текстом: Управление текстовыми данными
   * 
   * For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/core/lib/validator`:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/core/lib/validator`:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
   * Для получения дополнительных типов управляющих входных данных ознакомьтесь с репозиторием `incubator-superset`
* и откройте этот файл: superset-frontend/src/explore/components/controls/index.js
*
* Чтобы убедиться, что все элементы управления заполнены правильно, выполните следующее
* предоставляются валидаторы
* с помощью `@superset-ui/core/lib/validator`:
* - validateNonEmpty: должно иметь хотя бы одно значение
* - validateInteger: должно быть целочисленным значением
* - validateNumber: должно быть целым или десятичным значением
   *    
*/

  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t("Запрос"),
      expanded: true,
      controlSetRows: [
        [
          {
            name: "cols",
            config: {
              ...sharedControls.groupby,
              label: t("Столбцы"),
              description: t("Столбцы для группировки"),
            },
          },
        ],
        [
          {
            name: "metrics",
            config: {
              ...sharedControls.metrics,
              label: t("Метрики"),
              // it's possible to add validators to controls if
              // certain selections/types need to be enforced
              validators: [validateNonEmpty],
            },
          },
        ],
        ["adhoc_filters"],
        [
          {
            name: "row_limit",
            config: {
              ...sharedControls.row_limit,
              label: t("Ограничение для количества строк"),
            },
          },
        ],
      ],
    },
    {
      label: t("Настройки внешнего вида"),
      expanded: true,
      controlSetRows: [
        [
          {
            name: "orientation",
            config: {
              type: "SelectControl",
              label: t("Вид графика"),
              default: "",
              choices: [
                // [value, label]
                ["horizontal", "Горизонтальный"],
                ["vertical", "Вертикальный"],
              ],
              renderTrigger: true,
              description: t("Вид графика"),
            },
          },
          {
            name: "rectSize",
            config: {
              type: "SliderControl",
              default: 95,
              renderTrigger: true,
              label: t("Ширина столбцов"),
              description: t("%"),
            },
          },
        ],
        [
          {
            name: "sorting",
            config: {
              type: "SelectControl",
              label: t("Сортировка"),
              default: "",
              choices: [
                // [value, label]
                ["ascending", "По возрастанию"],
                ["descending", "По убыванию"],
              ],
              renderTrigger: true,
              description: t("Сортировка"),
            },
          },
        ],
        ["color_scheme"],
        [
          {
            name: "visualGroupMode",
            config: {
              type: "SelectControl",
              label: t("Вид группировки"),
              default: "",
              choices: [
                // [value, label]
                ["group", "По группам"],
                ["stacked", "Сложенный"],
              ],
              renderTrigger: true,
              description: t("Вид группировки"),
            },
          },
        ],
        /* [
          {
            name: 'visualGroupMode2',
            config: {
              type: 'CheckboxControl',
              label: t('Тест2'),
              //default: '',
              choices: [
                // [value, label]
                //['group', 'По группам'],
               // ['stacked', 'Сложенный']
              ],
              renderTrigger: true,
              description: t('Вид группировки'),
            },
          },
        ], */
        [
          {
            name: "labelPosition",
            config: {
              type: "SelectControl",
              label: t("Отображение значений"),
              default: "В конце",
              choices: [
                // [value, label]
                ["start", "В начале"],
                ["middle", "В центре"],
                ["end", "В конце"],
                ["none", "Не отображать"],
              ],
              renderTrigger: true,
              description: t("Расположение значений"),
            },
          },
        ],
        [
          {
            name: "xLimitLine",
            config: {
              type: "TextControl",
              default: 50,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Пороговое значение"),
              description: t("Пороговое значение"),
            },
          },
        ],
      ],
    },
    {
      label: t("Шрифты"),
      expanded: true,
      controlSetRows: [
        [
          {
            name: "labelFontSize",
            config: {
              type: "TextControl",
              default: 12,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Значения на графике"),
              description: t("Размер шрифта значений"),
            },
          },
        ],
        [
          {
            name: "xAxisFontSize",
            config: {
              type: "TextControl",
              default: 12,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Ось Х"),
              description: t("Размер шрифта на оси Х"),
            },
          },
        ],
        [
          {
            name: "yAxisFontSize",
            config: {
              type: "TextControl",
              default: 12,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Ось У"),
              description: t("Размер шрифта на оси У"),
            },
          },
        ],
      ],
    },
    {
      label: t("Отступы"),
      expanded: true,
      controlSetRows: [
        [
          {
            name: "paddingRight",
            config: {
              type: "TextControl",
              default: 40,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Cправа"),
              //description: t('Измените при необходимости '),
            },
          },
          {
            name: "paddingLeft",
            config: {
              type: "TextControl",
              default: 40,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Cлева"),
              //description: t('Пороговое значение'),
            },
          },
          {
            name: "paddingTop",
            config: {
              type: "TextControl",
              default: 0,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Cверху"),
              //description: t('Пороговое значение'),
            },
          },
          {
            name: "paddingBottom",
            config: {
              type: "TextControl",
              default: 40,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Cнизу"),
              //description: t('Пороговое значение'),
            },
          },
        ],
        [
          {
            name: "paddingInfoLabel",
            config: {
              type: "TextControl",
              default: 10,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Отступ подписей от оси У"),
              //description: t('Пороговое значение'),
            },
          },
        ],
      ],
    },
    {
      label: t("Легенда"),
      expanded: true,
      controlSetRows: [
        [
          {
            name: "legendIsVisible",
            config: {
              type: "CheckboxControl",
              label: t("Отображать легенду"),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: "legendX",
            config: {
              type: "TextControl",
              //default: 50,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Позиция по оси Х"),
              description: t("Положение крайней левой точки"),
              visibility: ({ controls }) =>
                Boolean(controls?.legendIsVisible?.value),
            },
          },

          {
            name: "legendY",
            config: {
              type: "TextControl",
              //default: 5,
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t("Позиция по оси У"),
              description: t("Положение крайней левой точки"),
              visibility: ({ controls }) =>
                Boolean(controls?.legendIsVisible?.value),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
