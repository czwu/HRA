import util from "./util"

export default class RelatedFlow {

    layout_width = 0 //面板总宽度

    layout_height = 0 //面板总高度

    uni_width = 0 //单元宽度

    uni_height = 50 //行高 预设默认值

    vertical_lines = [] //垂直分隔线

    horizontal_lines = [] //横向分割线

    related_values = [] //相关性等级 -> 分支结果集  

    related_options = [] //相关性的路由选项

    related_paths = [] //路径

    related_lines = [] //完整路径

    tree = null

    fields = []

    data = {}

    constructor(tree, fields, width) {

        this.tree = tree;
        this.layout_width = width;
        this.fields = fields;
        this.uni_width = (width / fields.length).toFixed(2);

        //统计分支数
        this.explainTree(tree);
        this.genSrc()
        this.related_options.forEach(item => {
            if (item.row_index == this.related_values.length - 1) {
                item.isLast = true;
            }
        })
        this.computePos();

        //垂直分隔线数 = field总数
        this.vertical_lines = new Array(fields.length);

        //横线数 = 分支数
        this.horizontal_lines = new Array(this.related_values.length);

        this.layout_height = this.uni_height * (this.horizontal_lines.length - 1) + this.horizontal_lines.length;
    }


    explainTree(data, parentObj) {
        if (!data.level) {
            data.level = parentObj ? parentObj.level + 1 : 0;
        }

        data.id = parentObj ? util.uuid(12) : ''
        let startRowIndex = this.related_values.length + 1;
        let branches = []
        if (data.branches) {
            data.branches.forEach((item, i) => {
                branches.push(this.explainTree(item, data))
            })
        }
        if (parentObj) {

            if (data.related) {
                this.related_values.push({
                    value: data.related,
                    level: data.level,
                    row_index: this.related_values.length,
                    selected: false,
                    isResult: true,
                    id: data.id,
                    related: data.related,
                    parentId: parentObj.id
                })
            }
            let endRowIndex = this.related_values.length;
            let rowIndex = endRowIndex;
            if (endRowIndex != startRowIndex) {
                rowIndex = startRowIndex + parseInt((endRowIndex - startRowIndex) / 2)
            }

            let rowIndex2 = this.related_values.length - 1;
            let totalIndex = 0
            if (branches.length) {
                branches.forEach(option => {
                    totalIndex += option.row_index
                })
                rowIndex2 = totalIndex / branches.length
            }

            let option1;
            this.related_options.push(option1 = {
                value: data.value,
                field: data.field,
                level: data.level,
                row_index: rowIndex2,
                id: data.id,
                related: data.related,
                parentId: parentObj.id,
                selected: false,
                branches
            })
            return option1
        }

    }

    computePos() {
        let w = this.uni_width;
        this.related_options.forEach(option => {
            option.value = option.value
            option.style = {
                top: parseInt(option.row_index * (this.uni_height + 1)) + 'px',
                left: w * (option.level - 0.5) - option.level + option.level * 0.3 + 'px'
            }
        })
    }

    selected(data) {
        if (data.selected) {
            return
        }
        let idsMap = {},
            tempData = data,
            optionsMap = {},
            selOptions = []
        this.related_options.forEach(option => {
            optionsMap[option.id] = option;
        })
        while (tempData) {
            idsMap[tempData.id] = true;
            selOptions.push(tempData);
            tempData = optionsMap[tempData.parentId || 'none'];
        }
        this.related_options.forEach(option => {
            option.selected = idsMap[option.id] ? true : false
        })

        if (data.isResult) {
            this.related_values.forEach(item => {
                item.selected = item == data
            })
        } else if (data.related) {
            this.related_values.forEach(item => {
                item.selected = item.row_index == data.row_index
            })
        } else {
            this.related_values.forEach(item => item.selected = false)
        }

        this.genPath(selOptions);
        this.setData(selOptions)
    }
    setData(selOptions) {
        selOptions.forEach(option => {
            this.data[option.field] = option.value
        })
        let value = this.related_values.filter(d => d.selected)[0];
        this.data['related_text'] = '';
        this.data['related_value'] = '';
        this.related_values.forEach((data, i) => {
            if (data.selected) {
                this.data['related_text'] = data.value;
                this.data['related_value'] = i + 1;
            }
        })
    }

    genSrc() {
        let lines = []
        let options = this.related_options.filter(i => i.level == 1)
        options.forEach(option => {
            this.genPathByOption(option);
            this.related_lines.push({
                css: 'path-line horizontal',
                style: {
                    top: parseInt(option.row_index * (this.uni_height + 1)) + 'px',
                    left: '10px',
                    width: this.uni_width * 0.5 + 'px'
                }
            });
        })
    }

    genPathByOption(option) {
        let w = this.uni_width;
        if (option.branches && option.branches.length) {
            let next = option.branches[0];
            option.branches.forEach(next => {
                this.genPathByOption(next);
                // 需要添加垂直路径线路
                this.related_lines.push({
                    css: 'path-line vertical',
                    style: {
                        top: Math.min(option.row_index, next.row_index) * (this.uni_height + 1) + 'px',
                        left: w * (option.level - 0.5) - option.level + option.level * 0.3 + 'px',
                        height: Math.abs(option.row_index - next.row_index) * (this.uni_height + 1) + 'px'
                    }
                });

                //添加水平路径线
                this.related_lines.push({
                    css: 'path-line horizontal',
                    style: {
                        top: parseInt(next.row_index * (this.uni_height + 1)) + 'px',
                        left: w * (option.level - 0.5) - option.level + option.level * 0.3 + 'px',
                        width: (next.level - option.level) * w + 'px'
                    }
                });
            })

        } else {
            //添加终点线路
            this.related_lines.push({
                css: 'path-line end horizontal',
                style: {
                    top: parseInt(option.row_index * (this.uni_height + 1)) + 'px',
                    left: w * (option.level - 0.5) - option.level + option.level * 0.3 + 'px',
                    width: (this.fields.length - option.level - 1) * w + 'px'
                }
            })
        }
    }




    genPath(selOptions) {
        let lines = [];
        let w = this.uni_width;
        selOptions.sort((a, b) => {
            return a.level - b.level
        });

        //添加水平路径线
        let opiton = selOptions[0];
        lines.push({
            css: 'path-line horizontal',
            style: {
                top: parseInt(opiton.row_index * (this.uni_height + 1)) + 'px',
                left: '10px',
                width: this.uni_width * 0.5 + 'px'
            }
        });

        selOptions.forEach((option, i) => {
            let next = selOptions[i + 1];
            if (next) {
                //如果下一个分支选择项,跟当前选择项不在一同一行上, 需要添加垂直路径线路
                if (next.row_index != option.row_index) {
                    lines.push({
                        css: 'path-line vertical',
                        style: {
                            top: Math.min(option.row_index, next.row_index) * (this.uni_height + 1) + 'px',
                            left: w * (option.level - 0.5) - option.level + option.level * 0.3 + 'px',
                            height: Math.abs(option.row_index - next.row_index) * (this.uni_height + 1) + 'px'
                        }
                    })
                }
                //添加水平路径线
                lines.push({
                    css: 'path-line horizontal',
                    style: {
                        top: parseInt(next.row_index * (this.uni_height + 1)) + 'px',
                        left: w * (option.level - 0.5) - option.level + option.level * 0.3 + 'px',
                        width: (next.level - option.level) * w + 'px'
                    }
                })
            }
            if (option.related) {
                //添加终点线路
                lines.push({
                    css: 'path-line end horizontal',
                    style: {
                        top: parseInt(option.row_index * (this.uni_height + 1)) + 'px',
                        left: w * (option.level - 0.5) - option.level + option.level * 0.3 + 'px',
                        width: (this.fields.length - option.level) * w + 'px'
                    }
                })
            }

        })
        this.related_paths = lines;

    }

}