import React, { useEffect, useState, useRef } from 'react';
/** Bootstraps Components */
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const ToDoList = (props) => {
    const endpoint = "https://assets.breatheco.de/apis/fake/todos/user";
    const user = "jdgut";
    const url = `${endpoint}/${user}`;
    const [myList, setList] = useState([]);

    //useRef will helpme set the initialValue that I am setting
    //that way I don't call updateAPI more than once when it initializes.
    const isInitialMount = useRef(true);

    useEffect( () => {
      initList();
    },[]);

    useEffect( () => {
      if(isInitialMount.current){
        isInitialMount.current = false;
      } else {
        updateAPI();
      }
    }, [myList]);

    const initList = () => {
      fetch(url)
      .then( (res) => {
        if(!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then( json => setList(json))
      .catch( error => console.log("There was an error processing request"));
    }

    const addTask = (e) => {
      if(e.keyCode === 13) {
        const task =  e.target.value.trim();
        const newList = [
          ...myList, 
          { label: task, done: false }
        ];
        e.target.value='';
        setList(newList);
      }
    }

    const deleteTask = (i) => {
        const newList = myList.filter((task, idx) => idx !== i);
        setList(newList);
    }


    const updateAPI = () => {
      fetch(url, {
        method: "put",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(myList)
      })
      .then(res => {
        if(!res.ok) throw Error(res.statusText);

        return res.json();
      }).catch( error => console.log(error) );
    }

    return (
        <>
            <Container>
                <h1>todos</h1>
                <Card style={{ width: '100%' }}>
                    <Card.Body>
                        <ListGroup as="ul" variant="flush">
                            <ListGroup.Item as="li">
                                <input type="text"
                                    placeholder="What needs to be done?"
                                    width="100%"
                                    onKeyDown={addTask} />
                            </ListGroup.Item>
                            {
                                myList.map(
                                    (task, idx) => (
                                        <ListGroup.Item as="li" key={idx} >
                                            {task.label}
                                            <button className="remove-task" onClick={() => deleteTask(idx)}>X</button>
                                        </ListGroup.Item>
                                    )
                                )
                            }
                        </ListGroup>
                        <footer className="footer border-top">
                            {myList.length} {myList.length === 1 ? `item` : `items`} left
                        </footer>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export { ToDoList as default };