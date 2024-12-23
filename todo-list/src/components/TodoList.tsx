'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

const StyledTodoList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f2f9;
  height: 100vh;

  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }

  .TodoList_cancel {
    text-decoration: line-through;
    color: #ff6b6b;
  }
`;

const TodoListWrapper = styled.div`
  background-color: #ffffff;
  border: none;
  border-radius: 20px; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 400px;
  text-align: center;

  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 20px 0;
  }
`;

const TodoInput = styled.input`
  border-radius: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  width: calc(100% - 60px);
  box-sizing: border-box;
  font-size: 1rem;
  margin-right: 10px;
`;

const AddButton = styled.button`
  background-color: #f2728c;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e55a5a;
  }
`;

const TodoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;

  p {
    margin: 0;
    font-size: 1rem;
  }

  select {
    border-radius: 10px;
    border: 1px solid #ddd;
    padding: 5px;
    font-size: 0.9rem;
    margin-right: 1rem;
    cursor: pointer;

  }

  button {
    background-color: transparent;
    border: none;
    font-size: 1rem;
    color: #f2728c;
    cursor: pointer;

    &:hover {
    color: #e55a5a;
  }
  }
`;

const ClearButton = styled.button`
  background-color: #fff;
  border: 2px solid #f2728c;
  color: #f2728c;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #f2728c;
    color: #fff;
  }
`;

type StatusType = '미시작' | '진행중' | '완료';

interface Todo {
  id: number;
  text: string;
  status: StatusType;
}

export default function TodoList() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');

  const addTodo = () => {
    if (!input.trim()) return; // 빈 입력 방지
    const stringId = uuidv4();
    const numericId = parseInt(stringId.replace(/-/g, '').slice(0,8), 16);
    setTodoList([
      ...todoList,
      { id: numericId, text: input, status: '미시작' },
    ]);
    setInput('');
  };

  const deleteTodo = (id: number) => {
    setTodoList(todoList.filter((todo) => todo.id !== id));
  };

  const changeTodoStatus = (id: number, status: StatusType) => {
    setTodoList(
      todoList.map((todo) =>
        todo.id === id ? { ...todo, status } : todo
      )
    );
  };

  const handleClearAll = () => {
    setTodoList([]);
  };

  return (
    <StyledTodoList>
      <TodoListWrapper>
        <h2>Todo List</h2>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <TodoInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="할 일을 입력해주세요"
          />
          <AddButton onClick={addTodo}>+</AddButton>
        </div>
        <hr />
        {todoList.map(({ id, text, status }) => (
          <TodoItem key={id}>
            <p className={status === '완료' ? 'TodoList_cancel' : ''}>{text}</p>
            <div>
                <select
                  value={status}
                  onChange={(e) =>
                    changeTodoStatus(id, e.target.value as StatusType)
                  }
                >
                  <option value="미시작">미시작</option>
                  <option value="진행중">진행중</option>
                  <option value="완료">완료</option>
                </select>
                <button onClick={() => deleteTodo(id)}>x</button>
            </div>
          </TodoItem>
        ))}
        {todoList.length > 0 && (
          <ClearButton onClick={handleClearAll}>전체 지우기</ClearButton>
        )}
      </TodoListWrapper>
    </StyledTodoList>
  );
}
