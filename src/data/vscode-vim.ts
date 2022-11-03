import type { DocData } from '@/components/Doc.vue';

export default [
  {
    type: 'command',
    command: '<leader><leader> w',
    desc: '向后高亮单词开头'
  },
  {
    type: 'command',
    command: '<leader><leader> b',
    desc: '向前高亮单词开头'
  },
  {
    type: 'command',
    command: '<leader><leader> e',
    desc: '向后高亮单词结尾'
  },
  {
    type: 'command',
    command: '<leader><leader> ge',
    desc: '向前高亮单词开头'
  },
  {
    type: 'command',
    command: '<leader><leader> j',
    desc: '向后高亮行开头'
  },
  {
    type: 'command',
    command: '<leader><leader> k',
    desc: '向前高亮行开头'
  },
  {
    type: 'line'
  },
  {
    type: 'command',
    command: 'y s <motion> <desired>',
    desc: '添加环绕符号'
  },
  {
    type: 'command',
    command: 'd s <existing>',
    desc: '删除环绕符号'
  },
  {
    type: 'command',
    command: 'c s <existing> <desired>',
    desc: '修改环绕符号'
  }
] as DocData;
