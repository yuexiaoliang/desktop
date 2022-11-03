import type { DocData } from '@/components/Doc.vue';

export default [
  {
    type: 'command',
    command: 'git clone <Url> -b <Dir> <B>',
    desc: '克隆指定分支到指定文件夹'
  },
  {
    type: 'command',
    command: 'git checkout -b <B> origin/<B>',
    desc: '拉取远程分支到本地分支'
  },
  {
    type: 'command',
    command: 'git reset –hard <CommitId>',
    desc: '回滚到之前某一commit'
  },
  {
    type: 'command',
    command: 'git remote prune origin',
    desc: '清理被删除远程分支在本地库的缓存'
  },

  { type: 'line' },
  {
    type: 'command',
    command: 'git branch -r',
    desc: '查看远程分支'
  },
  {
    type: 'command',
    command: 'git branch -a',
    desc: '查看所有分支'
  },
  {
    type: 'command',
    command: 'git branch -m OldName NewName',
    desc: '重命名分支'
  },

  { type: 'line' },
  {
    type: 'command',
    command: 'git log --abbrev-commit',
    desc: '简写形式输出 commit 的 hash 值'
  },
  {
    type: 'command',
    command: 'git log --grep <Keyword>',
    desc: '搜索关键字'
  },
  {
    type: 'command',
    command: 'git log --grep <Keyword> --author <Email>',
    desc: '检测关键字以及作者'
  },

  { type: 'line' },
  {
    type: 'command',
    command: 'git tag -a <V> -m "<Desc>"',
    desc: ' "添加 tag'
  },
  {
    type: 'command',
    command: 'git show v1.0.0',
    desc: '查看 tag 信息'
  },
  {
    type: 'command',
    command: 'git tag -l "*mongo"',
    desc: '查看所有以 mongo 结尾的 tag'
  }
  // {
  //   type: 'command',
  //   command: '',
  //   desc: ''
  // },
  // {
  //   type: 'command',
  //   command: '',
  //   desc: ''
  // },
  // {
  //   type: 'command',
  //   command: '',
  //   desc: ''
  // },
  // {
  //   type: 'command',
  //   command: '',
  //   desc: ''
  // },
  // {
  //   type: 'command',
  //   command: '',
  //   desc: ''
  // },
  // {
  //   type: 'command',
  //   command: '',
  //   desc: ''
  // }
] as DocData;
