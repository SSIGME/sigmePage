import React, { useState } from "react";
import { Table, Button, Modal, Input } from "antd";

const EditableTable = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      nombre: "Ejemplo 1",
      descripcion: "Descripción 1",
      componentes: [],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [componentes, setComponentes] = useState([]);
  const [newComponent, setNewComponent] = useState({ cantidad: "", nombre: "", descripcion: "" });

  const handleAddComponent = () => {
    setComponentes([...componentes, { ...newComponent, key: Date.now().toString() }]);
    setNewComponent({ cantidad: "", nombre: "", descripcion: "" });
  };

  const handleSaveComponents = () => {
    const newData = dataSource.map((item) =>
      item.key === editingKey ? { ...item, componentes } : item
    );
    setDataSource(newData);
    setModalVisible(false);
    setEditingKey(null);
    setComponentes([]);
  };

  const componentColumns = [
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
  ];

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Componentes",
      dataIndex: "componentes",
      key: "componentes",
      render: (_, record) => (
        <div>
          <Table dataSource={record.componentes} columns={componentColumns} pagination={false} />
          <Button
            onClick={() => {
              setEditingKey(record.key);
              setComponentes(record.componentes || []);
              setModalVisible(true);
            }}
            style={{ marginTop: 8 }}
          >
            Editar Componentes
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />

      <Modal
        title="Editar Componentes"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSaveComponents}
      >
        {componentes.map((comp, index) => (
          <div key={index}>
            <p>{comp.cantidad} - {comp.nombre}: {comp.descripcion}</p>
          </div>
        ))}
        <Input
          placeholder="Cantidad"
          value={newComponent.cantidad}
          onChange={(e) => setNewComponent({ ...newComponent, cantidad: e.target.value })}
        />
        <Input
          placeholder="Nombre"
          value={newComponent.nombre}
          onChange={(e) => setNewComponent({ ...newComponent, nombre: e.target.value })}
        />
        <Input
          placeholder="Descripción"
          value={newComponent.descripcion}
          onChange={(e) => setNewComponent({ ...newComponent, descripcion: e.target.value })}
        />
        <Button onClick={handleAddComponent}>Agregar</Button>
      </Modal>
    </div>
  );
};

export default EditableTable;
