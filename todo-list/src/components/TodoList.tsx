'use client';

import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';

type StatusType = '미시작' | '진행중' | '완료';

interface Todo {
  id: string;
  text: string;
}

interface DragItem {
  id: string;
  fromColumn: StatusType;
}

export default function KanbanBoard() {
  const [board, setBoard] = useState<Record<StatusType, Todo[]>>({
    미시작: [],
    진행중: [],
    완료: [],
  });

  const [input, setInput] = useState('');

  // 할 일 추가
  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = { id: Date.now().toString(), text: input };
    setBoard((prevBoard) => ({
      ...prevBoard,
      미시작: [...prevBoard.미시작, newTodo],
    }));
    setInput('');
  };

  // 할 일 이동
  const moveTodo = (id: string, fromColumn: StatusType, toColumn: StatusType) => {
    const fromItems = [...board[fromColumn]];
    const toItems = [...board[toColumn]];

    const index = fromItems.findIndex((item) => item.id === id);
    if (index >= 0) {
      const [movedItem] = fromItems.splice(index, 1);
      toItems.push(movedItem);

      setBoard({
        ...board,
        [fromColumn]: fromItems,
        [toColumn]: toItems,
      });
    }
  };

  // 할 일 삭제
  const deleteTodo = (id: string, column: StatusType) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      [column]: prevBoard[column].filter((todo) => todo.id !== id),
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <MainWrapper>
        <h2>Todo List</h2>
        <InputWrapper>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="할 일을 입력하세요"
          />
          <button onClick={addTodo}>추가</button>
        </InputWrapper>
        <BoardWrapper>
          {Object.entries(board).map(([status, todos]) => (
            <KanbanColumn
              key={status}
              status={status as StatusType}
              todos={todos}
              moveTodo={moveTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </BoardWrapper>
      </MainWrapper>
    </DndProvider>
  );
}

function KanbanColumn({
  status,
  todos,
  moveTodo,
  deleteTodo,
}: {
  status: StatusType;
  todos: Todo[];
  moveTodo: (id: string, fromColumn: StatusType, toColumn: StatusType) => void;
  deleteTodo: (id: string, column: StatusType) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'TODO',
    drop: (item: DragItem) => {
      if (item.fromColumn !== status) {
        moveTodo(item.id, item.fromColumn, status);
      }
    },
  });

  drop(ref);

  return (
    <Column ref={ref}>
      <h3>{status}</h3>
      {todos.map((todo) => (
        <KanbanCard
          key={todo.id}
          todo={todo}
          fromColumn={status}
          deleteTodo={deleteTodo}
        />
      ))}
    </Column>
  );
}

function KanbanCard({
  todo,
  fromColumn,
  deleteTodo,
}: {
  todo: Todo;
  fromColumn: StatusType;
  deleteTodo: (id: string, column: StatusType) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drag] = useDrag({
    type: 'TODO',
    item: { id: todo.id, fromColumn },
  });

  drag(ref);

  return (
    <Card ref={ref}>
      <p>{todo.text}</p>
      <button onClick={() => deleteTodo(todo.id, fromColumn)}>X</button>
    </Card>
  );
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;

  input {
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    width: 70%;
  }

  button {
    padding: 10px 20px;
    background-color: #efaed9;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;

    &:hover {
      background-color: #f290d2;
    }
  }
`;

const BoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

const Column = styled.div`
  flex: 1;
  background-color: #ebdae6;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 150px; 
  max-width: 250px;

  h3 {
    text-align: center;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin: 0;
    font-size: 1rem;
  }

  button {
    background-color: white;
    color: #e74c3c;
    border: none;
    padding: 5px;
    cursor: pointer;

    &:hover {
      color: #c0392b;
    }
  }
`;
